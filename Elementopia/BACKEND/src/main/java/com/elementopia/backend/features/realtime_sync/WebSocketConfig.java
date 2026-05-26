package com.elementopia.backend.features.realtime_sync;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "/topic" is the prefix for broadcasting messages back to the React clients
        config.enableSimpleBroker("/topic");

        // "/app" is the prefix React uses to send messages TO the server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // The initial handshake endpoint your React app connects to
        registry.addEndpoint("/api/ws/matchmaking")
                .setAllowedOriginPatterns("*") // Prevents CORS blocks during the WebSocket handshake
                .withSockJS(); // Fallback protocol if raw WebSockets are blocked by a school firewall
    }
}