from fastapi import APIRouter, Request
from app.schemas.city_schemas import AssistantChatRequest, AssistantChatResponse
from app.ai.assistant import UrbanSyncAIAssistant

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])

@router.post("/chat", response_model=AssistantChatResponse)
async def chat_with_assistant(req: AssistantChatRequest, request: Request):
    """Processes user queries via Groq LLM Assistant with tool calling over UrbanSync backend data."""
    scheduler = request.app.state.scheduler
    assistant = UrbanSyncAIAssistant(scheduler=scheduler)
    response = await assistant.generate_response(req.messages, req.user_location)
    return response
