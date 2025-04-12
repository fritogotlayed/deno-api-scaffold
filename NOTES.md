# Demonstrated concepts

- Dependency injection
- Separation of concerns
  - Domain logic is decoupled from infrastructure, request/response shaping,
    etc.
  - Domain is separated from presentation layer. I.e. could be HTTP API, GQL,
    RPC, etc.
- Infrastructure abstracted. I.e. db can be swapped out in future without
  affecting domain logic
- Integration tests utilize isolated test database to avoid cross-contamination

# Other items to add examples of

- cross-domain orchestration
  - I.e. add user/team and address in same HTTP request
- Swagger/OpenAPI endpoint
- Unit tests
- Documentation around what each module does to aid in adoption if we migrate to
  a similar architecture
