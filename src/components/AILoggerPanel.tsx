import { useState, useEffect } from 'react';
import { aiLogger, type SessionLog } from '@/lib/ai/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function AILoggerPanel() {
  const [session, setSession] = useState<SessionLog | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Обновляем каждую секунду
    const interval = setInterval(() => {
      setSession(aiLogger.getSession());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="shadow-lg"
        >
          📊 AI Логи
        </Button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-96">
        <Card>
          <CardHeader>
            <CardTitle>Логи AI</CardTitle>
            <CardDescription>Нет активной сессии</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalRequests = session.requests.length;
  const avgCostPerRequest = totalRequests > 0 ? session.totalCost / totalRequests : 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[500px] max-h-[600px] overflow-auto">
      <Card className="shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>📊 AI Логирование</CardTitle>
              <CardDescription className="text-xs mt-1">
                {session.sessionId}
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Инициализация RAG */}
          {session.initialization && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">🔄 Инициализация RAG</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Файлов:</span>
                  <span className="ml-2 font-mono">{session.initialization.filesLoaded}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Chunks:</span>
                  <span className="ml-2 font-mono">{session.initialization.totalChunks}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Токенов:</span>
                  <span className="ml-2 font-mono">
                    {session.initialization.embeddingTokensEstimate.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Стоимость:</span>
                  <span className="ml-2 font-mono text-green-600">
                    ${session.initialization.embeddingCostEstimate.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Общая статистика */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">💰 Итого по сессии</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Запросов:</span>
                <span className="ml-2 font-mono">{totalRequests}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Токенов вход:</span>
                <span className="ml-2 font-mono">{session.totalTokensIn.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Токенов выход:</span>
                <span className="ml-2 font-mono">{session.totalTokensOut.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Общая стоимость:</span>
                <span className="ml-2 font-mono font-bold text-red-600">
                  ${session.totalCost.toFixed(6)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">За запрос:</span>
                <span className="ml-2 font-mono text-blue-600">
                  ${avgCostPerRequest.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Последние запросы */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">📝 Последние запросы</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {session.requests.slice(-5).reverse().map((req) => (
                <Card key={req.requestId} className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-xs">
                        #{req.requestId}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(req.timestamp).toLocaleTimeString('ru-RU')}
                      </span>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-muted-foreground">Вопрос:</span>
                      <p className="mt-1 text-sm">
                        {req.userMessage.substring(0, 60)}
                        {req.userMessage.length > 60 && '...'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">RAG chunks:</span>
                        <span className="ml-1 font-mono">{req.ragSearch.chunksFound}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Модель:</span>
                        <span className="ml-1 font-mono">{req.openaiRequest.model}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Токены in:</span>
                        <span className="ml-1 font-mono">{req.openaiRequest.totalInputTokens}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Токены out:</span>
                        <span className="ml-1 font-mono">{req.openaiRequest.outputTokens}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Стоимость:</span>
                        <span className="ml-1 font-mono font-semibold text-orange-600">
                          ${req.openaiRequest.totalCost.toFixed(6)}
                        </span>
                      </div>
                    </div>

                    {/* Детализация токенов */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Детали токенов
                      </summary>
                      <div className="mt-2 space-y-1 pl-2 border-l-2 border-muted">
                        <div>
                          Системный промпт: <span className="font-mono">{req.openaiRequest.systemPromptTokens}</span>
                        </div>
                        <div>
                          RAG контекст: <span className="font-mono">{req.openaiRequest.ragContextTokens}</span>
                        </div>
                        <div>
                          Сообщения: <span className="font-mono">{req.openaiRequest.messagesTokens}</span>
                        </div>
                      </div>
                    </details>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Действия */}
          <div className="flex gap-2">
            <Button
              onClick={() => aiLogger.printSummary()}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              📄 Консоль
            </Button>
            <Button
              onClick={() => aiLogger.downloadSessionLog()}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              💾 Скачать
            </Button>
            <Button
              onClick={() => aiLogger.saveSession()}
              size="sm"
              className="flex-1"
            >
              ✅ Сохранить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
