## Using Drizzle

The infrastructure module uses [Drizzle](https://orm.drizzle.team/) as its ORM.
As such, there are deno tasks that are available to interact with the database.

- deno task tool:drizzle generate --name some-name
- deno task tool:drizzle migrate
- deno task tool:drizzle drop

## Adding a new feature guideline

Working within a project that maintains a high separation between core logic and
other concerns, such as presentation, can be challenging for those inexperienced
with the approach. Before getting started, it is important to understand why the
separation is important. Ideally we are modeling the domain, it's rules, and the
interactions between domain elements without regard to how the domain is
presented to the user or how the domain is persisted. This allows us to change
how our domain is consumed or persisted without affecting the domain itself.

When adding a new feature you will likely need to start in the `src/core`
directory. We have a focus on keeping our domains "feature" oriented. This means
that we want to keep our domain models as small as possible. In the event where
a domain feature is dependent on another domain feature, we prefer utilize a
dependency injection approach. An example of this can be seen in the team
feature where we allow adding a team and a address in the same request.

### Adding a new feature - cheat sheet

- Add the feature to the `src/core` directory
  - This includes the domain model, repository interface, and the use cases or
    logic
  - This is a great time to add any unit tests for the feature as needed
- Add the persistence mechanism for the feature to the `src/infrastructure`
  directory
  - Don't forget to generate the migration for the new feature
- Add the new feature to the `src/presentation` and/or `src/shared`
  directory/directories
- Add applicable integration tests to the `tests/integration` directory

A handy mnemonic for remembering the order of the above steps is "CIP",
pronounced "sip".

- C - Core
- I - Infrastructure
- P - Presentation
