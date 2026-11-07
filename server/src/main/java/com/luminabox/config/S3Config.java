package com.luminabox.config;

import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.checksums.ResponseChecksumValidation;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

/** Backblaze B2 through its S3-compatible API. */
@Configuration
public class S3Config {
    private final URI endpoint;
    private final Region region;
    private final StaticCredentialsProvider credentials;

    public S3Config(
            @Value("${app.b2.endpoint}") String endpoint,
            @Value("${app.b2.region}") String region,
            @Value("${app.b2.key-id}") String keyId,
            @Value("${app.b2.application-key}") String applicationKey) {
        this.endpoint = URI.create(endpoint.startsWith("http") ? endpoint : "https://" + endpoint);
        this.region = Region.of(region);
        this.credentials = StaticCredentialsProvider.create(AwsBasicCredentials.create(keyId, applicationKey));
    }

    @Bean
    S3Client s3Client() {
        return S3Client.builder()
                .endpointOverride(endpoint)
                .region(region)
                .credentialsProvider(credentials)
                // B2 does not accept the default CRC checksums newer SDKs add to every request
                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                .responseChecksumValidation(ResponseChecksumValidation.WHEN_REQUIRED)
                .build();
    }

    @Bean
    S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .endpointOverride(endpoint)
                .region(region)
                .credentialsProvider(credentials)
                .build();
    }
}
