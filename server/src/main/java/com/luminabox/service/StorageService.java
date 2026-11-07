package com.luminabox.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
public class StorageService {
    public record StoredObject(String key, long size, Instant lastModified) {}

    private final S3Client s3;
    private final S3Presigner presigner;
    private final String bucket;

    public StorageService(S3Client s3, S3Presigner presigner, @Value("${app.b2.bucket-name}") String bucket) {
        this.s3 = s3;
        this.presigner = presigner;
        this.bucket = bucket;
    }

    public void put(String key, InputStream body, long size, String contentType) throws IOException {
        s3.putObject(
                PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
                RequestBody.fromInputStream(body, size));
    }

    /** Lists objects under the prefix, with keys returned relative to it. */
    public List<StoredObject> list(String prefix) {
        return s3.listObjectsV2Paginator(ListObjectsV2Request.builder().bucket(bucket).prefix(prefix).build())
                .contents().stream()
                .map(o -> new StoredObject(o.key().substring(prefix.length()), o.size(), o.lastModified()))
                .toList();
    }

    public void delete(String key) {
        s3.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }

    public String presignGet(String key, Duration ttl) {
        GetObjectRequest get = GetObjectRequest.builder().bucket(bucket).key(key).build();
        return presigner.presignGetObject(
                        GetObjectPresignRequest.builder().signatureDuration(ttl).getObjectRequest(get).build())
                .url()
                .toString();
    }

    public ResponseBytes<GetObjectResponse> getFirstBytes(String key, int count) {
        return s3.getObjectAsBytes(
                GetObjectRequest.builder().bucket(bucket).key(key).range("bytes=0-" + (count - 1)).build());
    }
}
