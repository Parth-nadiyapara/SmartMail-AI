from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from models import EmailAnalysisResponse
from services.gemini_service import gemini_service


app = FastAPI(
    title="SmartMail AI Service",
    description="Python AI service for SmartMail AI",
    version="1.1.0",
)


class EmailAnalysisRequest(BaseModel):

    emailBody: str = Field(
        min_length=1
    )


@app.get("/")
def root():

    return {
        "success": True,
        "message": "SmartMail AI Python Service Running"
    }


@app.get("/health")
def health():

    return {
        "success": True,
        "service": "ai-service",
        "status": "healthy"
    }


@app.post(
    "/analyze",
    response_model=dict
)
def analyze_email(
    request: EmailAnalysisRequest
):

    try:

        analysis = gemini_service.analyze_email(
            request.emailBody
        )

        validated_analysis = (
            analysis.model_dump()
        )

        return {
            "success": True,
            "message": "Email analyzed successfully.",
            "data": validated_analysis
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        status_code = getattr(
            error,
            "status_code",
            500
        )

        print(
            "AI Service Error:",
            error
        )

        raise HTTPException(
            status_code=status_code,
            detail=(
                str(error)
                if status_code != 500
                else "Failed to analyze email."
            )
        )