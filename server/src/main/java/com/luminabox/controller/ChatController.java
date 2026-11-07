package com.luminabox.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.luminabox.error.ApiException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private static final int MAX_MESSAGES = 20;
    private static final int MAX_MESSAGE_CHARS = 2000;

    private static final String SYSTEM_PROMPT = """
            You are Angela, the friendly assistant of Lumina Box, a cloud file storage app where users upload files, organize them in folders, mark favorites, share files and keep a trash bin.
            Answer briefly (a few sentences), using simple Markdown (short lists, bold) only when it helps, and in the same language the user writes in. Help with using the app and general questions. You cannot see or access the user's files, so don't claim to; if asked about a specific file, explain how they can find it in the app.""";

    public record Message(String role, String content) {}

    public record ChatRequest(List<Message> messages) {}

    private final String apiKey;
    private final RestClient anthropic = RestClient.builder()
            .baseUrl("https://api.anthropic.com")
            .defaultHeader("anthropic-version", "2023-06-01")
            .build();

    public ChatController(@Value("${app.anthropic-api-key}") String apiKey) {
        this.apiKey = apiKey;
    }

    @PostMapping
    Map<String, String> chat(@RequestBody(required = false) ChatRequest body) {
        if (apiKey.isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Angela is not configured");
        }
        if (!isValid(body)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid messages");
        }

        List<Message> messages = body.messages();
        messages = messages.subList(Math.max(0, messages.size() - MAX_MESSAGES), messages.size());

        try {
            JsonNode response = anthropic.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .body(Map.of(
                            "model", "claude-opus-5-5",
                            "max_tokens", 2000,
                            "output_config", Map.of("effort", "low"),
                            "system", SYSTEM_PROMPT,
                            "messages", messages))
                    .retrieve()
                    .body(JsonNode.class);

            StringBuilder reply = new StringBuilder();
            for (JsonNode block : response.path("content")) {
                if ("text".equals(block.path("type").asText())) {
                    reply.append(block.path("text").asText());
                }
            }
            return Map.of("reply", reply.toString().trim());
        } catch (RuntimeException e) {
            log.error("Chat failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Angela could not answer right now");
        }
    }

    private static boolean isValid(ChatRequest body) {
        if (body == null || body.messages() == null || body.messages().isEmpty()) {
            return false;
        }
        for (Message m : body.messages()) {
            if (m == null
                    || !("user".equals(m.role()) || "assistant".equals(m.role()))
                    || m.content() == null
                    || m.content().isBlank()
                    || m.content().length() > MAX_MESSAGE_CHARS) {
                return false;
            }
        }
        return "user".equals(body.messages().get(body.messages().size() - 1).role());
    }
}
