package com.sainiproperties.saini_properties_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryRequest {

    private String targetEmail;
    private String userEmail;
    private Long propertyId;
    private String propertyName;
    private String message;
}