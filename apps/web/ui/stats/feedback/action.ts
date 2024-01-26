"use server";

import { nanoid } from "@artst/utils";
import { resend } from "emails";
import FeedbackEmail from "emails/feedback-email";

export async function submitFeedback(data: FormData) {
	const email = data.get("email") as string;
	const feedback = data.get("feedback") as string;

	return await resend?.emails.send({
		from: "feedback@artst.io",
		to: ["burak@artst.io"],
		...(email && { reply_to: email }),
		subject: "🎉 New Feedback Received!",
		react: FeedbackEmail({
			email,
			feedback,
		}),
		headers: {
			"X-Entity-Ref-ID": nanoid(),
		},
	});
}
