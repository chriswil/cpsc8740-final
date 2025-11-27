import os
import json
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv(override=True)

# Configuration
AI_PROVIDER = os.getenv("DEFAULT_SUMMARY_METHOD", "anthropic").lower()
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-opus-20240229")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

# Initialize Anthropic client if needed
anthropic_client = None
if AI_PROVIDER == "anthropic" and ANTHROPIC_API_KEY:
    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)

def generate_flashcards(text: str, num_cards: int = 5, exclude_topics: List[str] = None) -> List[Dict[str, str]]:
    """
    Generate flashcards using the configured AI provider.
    """
    if not text:
        return []
    
    system_prompt = "You are a helpful study assistant. You MUST return a valid JSON array of objects. Do not include any other text."
    
    # Build the exclusion instruction if topics are provided
    exclusion_text = ""
    if exclude_topics:
        topics_list = "\n".join([f"- {topic}" for topic in exclude_topics])
        exclusion_text = f"""
    IMPORTANT: The following topics have already been covered in previous flashcard sets.
    You MUST generate flashcards on DIFFERENT concepts and topics:
    {topics_list}
    
    Focus on NEW aspects, alternative perspectives, or related but distinct concepts.
    """
    
    prompt = f"""
    Generate EXACTLY {num_cards} flashcards based on the following text.
    Return ONLY a JSON array of objects with 'front' and 'back' keys.
    {exclusion_text}
    Example JSON format:
    [
        {{"front": "Question 1", "back": "Answer 1"}},
        {{"front": "Question 2", "back": "Answer 2"}},
        ... (total of {num_cards} objects)
    ]
    
    Text:
    {text[:10000]}
    """
    
    if AI_PROVIDER == "ollama":
        return _generate_with_ollama(prompt, system_prompt)
    else:
        return _generate_with_anthropic(prompt)

def generate_quiz(text: str, num_questions: int = 5) -> List[Dict[str, Any]]:
    """
    Generate a quiz using the configured AI provider.
    """
    if not text:
        return []
        
    system_prompt = "You are a helpful study assistant. You MUST return a valid JSON array of objects. Do not include any other text."

    prompt = f"""
    Generate EXACTLY {num_questions} multiple-choice questions based on the following text.
    Return ONLY a JSON array of objects with the following structure:
    
    Example JSON format:
    [
        {{
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A"
        }},
        ... (total of {num_questions} objects)
    ]
    
    Text:
    {text[:10000]}
    """
    
    if AI_PROVIDER == "ollama":
        return _generate_with_ollama(prompt, system_prompt)
    else:
        return _generate_with_anthropic(prompt)

def _generate_with_anthropic(prompt: str) -> Any:
    if not anthropic_client:
        print("Anthropic client not initialized. Check API key.")
        return []
        
    try:
        response = anthropic_client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        content = response.content[0].text
        return _parse_json_response(content)
    except Exception as e:
        print(f"Anthropic Error: {str(e)}")
        return []

def _generate_with_ollama(prompt: str, system_prompt: str = None) -> Any:
    try:
        url = f"{OLLAMA_URL}/api/generate"
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        print(f"Sending request to Ollama: {url}, model={OLLAMA_MODEL}")
        response = httpx.post(url, json=payload, timeout=60.0)
        response.raise_for_status()
        
        result = response.json()
        content = result.get("response", "")
        print(f"Ollama Raw Response: {content[:200]}...") 
        
        parsed = _parse_json_response(content)
        
        # Fix: If model returns a single object instead of a list, wrap it
        if isinstance(parsed, dict):
            print("Warning: Model returned a single object instead of a list. Wrapping it.")
            parsed = [parsed]
            
        if not parsed:
            print(f"Failed to parse JSON. Raw content: {content}")
            
        return parsed
    except Exception as e:
        print(f"Ollama Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return []

def generate_chat_response(messages: List[Dict[str, str]], context_text: str) -> str:
    """
    Generate a chat response based on conversation history and document context.
    """
    system_prompt = f"""You are a helpful AI study assistant. 
    Answer the user's questions based ONLY on the provided context. 
    If the answer is not in the context, say "I cannot answer this based on the document."
    
    Context:
    {context_text[:10000]}
    """
    
    # Prepare messages for the AI
    ai_messages = []
    
    # Add system prompt
    if AI_PROVIDER == "anthropic":
        # Anthropic uses a separate system parameter, but we can also prepend it to the first user message
        # or strictly use the system parameter if the client supports it.
        # For simplicity in this specific function structure, we'll handle it in the call.
        pass 
    elif AI_PROVIDER == "ollama":
        # Ollama accepts system message in the list or as a parameter
        pass

    # Convert history to format expected by provider
    # We assume messages is a list of {"role": "user"/"assistant", "content": "..."}
    
    if AI_PROVIDER == "ollama":
        return _chat_with_ollama(messages, system_prompt)
    else:
        return _chat_with_anthropic(messages, system_prompt)

def _chat_with_anthropic(messages: List[Dict[str, str]], system_prompt: str) -> str:
    if not anthropic_client:
        return "Error: Anthropic client not initialized."
        
    try:
        response = anthropic_client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            system=system_prompt,
            messages=messages
        )
        return response.content[0].text
    except Exception as e:
        print(f"Anthropic Chat Error: {str(e)}")
        return "I encountered an error while processing your request."

def _chat_with_ollama(messages: List[Dict[str, str]], system_prompt: str) -> str:
    try:
        url = f"{OLLAMA_URL}/api/chat"
        
        # Ollama expects system message as a message with role "system" in the messages list
        # OR as a separate parameter. Let's use the messages list approach for chat.
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        payload = {
            "model": OLLAMA_MODEL,
            "messages": full_messages,
            "stream": False
        }
        
        print(f"Sending chat request to Ollama: {url}, model={OLLAMA_MODEL}")
        response = httpx.post(url, json=payload, timeout=60.0)
        response.raise_for_status()
        
        result = response.json()
        return result.get("message", {}).get("content", "")
    except Exception as e:
        print(f"Ollama Chat Error: {str(e)}")
        return "I encountered an error while processing your request."

def suggest_category(text: str) -> str:
    """
    Suggest a category for the document based on its content.
    Returns a short string (e.g., "History", "Science", "Business").
    """
    if not text:
        return "Uncategorized"
        
    system_prompt = "You are a helpful assistant that classifies documents into single-word categories."
    
    prompt = f"""
    Classify the following text into a single, broad category (e.g., History, Science, Math, Literature, Business, Law, Medicine, Technology, Computer Science, Engineering, Economics).
    Return ONLY the category name. Do not include any other text or punctuation.
    
    Text:
    {text[:5000]}
    """
    
    try:
        if AI_PROVIDER == "ollama":
            # Reuse _generate_with_ollama but we need to handle non-JSON response
            # Since _generate_with_ollama expects JSON, we'll make a simple direct call here.
            url = f"{OLLAMA_URL}/api/generate"
            payload = {
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "system": system_prompt,
                "stream": False
            }
            response = httpx.post(url, json=payload, timeout=30.0)
            if response.status_code == 200:
                return response.json().get("response", "").strip()
            return "Uncategorized"
        else:
            if not anthropic_client:
                return "Uncategorized"
            response = anthropic_client.messages.create(
                model=ANTHROPIC_MODEL,
                max_tokens=50,
                system=system_prompt,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text.strip()
    except Exception as e:
        print(f"Category suggestion error: {str(e)}")
        return "Uncategorized"

def _parse_json_response(content: str) -> Any:
    try:
        # Clean up potential markdown formatting
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)
    except json.JSONDecodeError:
        print(f"Failed to parse JSON response: {content[:100]}...")
        return []
