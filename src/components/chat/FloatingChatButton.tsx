import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FloatingChatButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="hero"
      size="xl"
      className="fixed bottom-6 right-6 rounded-full shadow-elevated hover:shadow-glow z-40 gap-2"
      onClick={() => navigate("/")}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Задать вопрос</span>
    </Button>
  );
}
