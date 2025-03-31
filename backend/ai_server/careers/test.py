#!/usr/bin/env python

import asyncio
import os

from mistralai.async_client import MistralAsyncClient
from mistralai.models.chat_completion import ChatMessage


async def main():
    #api_key = os.environ["MISTRAL_API_KEY"]
    api_key = "n28Nx7OaLGsnGQq3zyhCVBBvYeSv0zrd"
    model = "open-mistral-7b"

    client = MistralAsyncClient(api_key=api_key)

    chat_response = await client.chat(
        model=model,
        messages=[ChatMessage(role="user", content="A 10th-grade student would like to pursue a career as an {Education Consultant}. Provide Guidance on the Higher Education (Undergraduate Level) for this career in India and abroad using the following points.\n\n- Entrance Exams for higher education, \n- How to prepare for these entrance exams, and  \n- List top 10 reputable institutions, links to their website, indicative fee structure and yearly cost for bachelor's degree.\n- List top 10 reputable institutions in and around Pune, India, links to their website, indicative fee structure and yearly cost for bachelor's degree.")],
    )

    print(chat_response.choices[0].message.content)

    await client.close()


if __name__ == "__main__":
    asyncio.run(main())