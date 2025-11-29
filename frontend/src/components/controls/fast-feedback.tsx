import { useEffect, useRef } from "react";
import { Button } from "../ui/button";

export default function FeedbackWidget() {
  const widgetRef = useRef(null);
  const configRef = useRef({
    projectKey:
      "feedbacks_dev_api_key_1a84b2bff61864d634e4cbfec296ccb78b831217",
    embedMode: "trigger",
    target: "#feedback-button",
    primaryColor: "#f2a463",
    backgroundColor: "#212121",
    enableScreenshot: true,
    successTitle: "Thank you!",
    successDescription:
      "I appreciate you taking the time to share your thoughts.",
    formSubtitle: "Help me improve by sharing your thoughts",
    headerIcon: "chat",
    spacing: 24,
    modalWidth: 480,
    inlineBorder: "1px solid rgba(15,23,42,0.08)",
    inlineShadow: "0 16px 40px rgba(15,23,42,0.12)",
    rateLimitCount: 5,
    rateLimitWindowSec: 60,
  });

  useEffect(() => {
    let cleanup = null;

    // Load CSS if not already loaded
    if (
      !document.querySelector(
        'link[href="https://app.feedbacks.dev/cdn/widget/latest.css"]',
      )
    ) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://app.feedbacks.dev/cdn/widget/latest.css";
      document.head.appendChild(link);
    }

    // Load and initialize widget
    const initWidget = () => {
      if ((window as any).FeedbacksWidget) {
        widgetRef.current = new (window as any).FeedbacksWidget(
          configRef.current,
        );
      }
    };

    if (
      !(window as any).FeedbacksWidget &&
      !document.querySelector(
        'script[src="https://app.feedbacks.dev/cdn/widget/latest.js"]',
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://app.feedbacks.dev/cdn/widget/latest.js";
      script.onload = initWidget;
      script.onerror = () => console.error("Failed to load FeedbacksWidget");
      document.head.appendChild(script);
    } else {
      initWidget();
    }

    // Cleanup function
    return () => {
      if (
        widgetRef.current &&
        typeof (widgetRef.current as any).destroy === "function"
      ) {
        (widgetRef.current as any).destroy();
        widgetRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Button
        size={"lg"}
        variant={"secondary"}
        className="w-full rounded-xl border-2 border-neutral-800 bg-[#0b0a0f]/0 p-8 text-lg text-white backdrop-blur-sm"
        id="feedback-button"
      >
        Give Instant Feedback
      </Button>
    </>
  );
}
