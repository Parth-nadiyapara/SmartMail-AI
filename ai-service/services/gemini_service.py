import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import ValidationError

from models import EmailAnalysisResponse
from prompts.email_analysis_prompt import build_email_analysis_prompt


load_dotenv()


MODEL_NAME = "gemini-3.5-flash-lite"


class GeminiService:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY is missing. "
                "Please add it to ai-service/.env"
            )

        self.client = genai.Client(
            api_key=api_key
        )

    def analyze_email(
        self,
        email_body: str
    ) -> EmailAnalysisResponse:

        if not email_body or not email_body.strip():
            raise ValueError(
                "Email body is empty."
            )

        prompt = build_email_analysis_prompt(
            email_body
        )

        try:

            response = self.client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    response_mime_type="application/json",
                ),
            )

        except Exception as error:

            print(
                "Gemini API Error:",
                error
            )

            service_error = RuntimeError(
                "Gemini AI service failed."
            )

            service_error.status_code = 502

            raise service_error from error

        response_text = (
            response.text or ""
        ).strip()

        if not response_text:

            service_error = RuntimeError(
                "Gemini returned an empty response."
            )

            service_error.status_code = 502

            raise service_error

        try:

            result = json.loads(
                response_text
            )

        except json.JSONDecodeError as error:

            print(
                "Gemini returned invalid JSON:"
            )

            print(response_text)

            service_error = RuntimeError(
                "Gemini returned an invalid JSON response."
            )

            service_error.statusCode = 502

            raise service_error from error

        try:

            return EmailAnalysisResponse.model_validate(
                result
            )

        except ValidationError as error:

            print(
                "Gemini returned invalid analysis structure:"
            )

            print(error)

            service_error = RuntimeError(
                "Gemini returned an invalid analysis structure."
            )

            service_error.status_code = 502

            raise service_error from error


gemini_service = GeminiService()