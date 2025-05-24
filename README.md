# trip-planner

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technologies used

- Docker: Reproducible, ephemeral containerization. Since it is more popular than Podman, Nix or Guix, hence the choice. For production, I've made use
  of a multi-stage Dockerfile to optimize image size and make it easier to read.

- TypeScript: Type safety and compile-time checks for JavaScript.

- NextJS: For a monolithic web application containing both front-end and back-end. I have also enabled standalone builds to further reduce the size.

- Tailwind: Utility-driven CSS library, also a shadcn dependency.

- shadcn/ui: For quickly building web pages with pre-styled, pre-defined components.

- PostgreSQL: Since I am used to working on PostgreSQL, hence the choice.

- Prisma: To design schema and migrations for the database.

## Getting Started

Before running this project, please ensure that Docker and Docker Compose is present in the system with relevant permissions and configurations.

- First, clone the following project onto a local machine:

```console
$ git clone https://codeberg.org/Ashvith/trip-planner.git
```

- `cd` inside the `trip-planner` directory and create a `.env` file with the following content:

```console
DATABASE_URL="postgresql://postgres@trip-planner-postgres:5432/trip-planner?schema=public"
```

- Now, run the services using Docker Compose:

  - To run the development server:

  ```console
  docker-compose -f docker-compose.dev.yml up --build
  ```

  - To run the production server:

  ```console
  docker-compose -f docker-compose.prod.yml up --build
  ```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Schema

To check the schema files, please check the [prisma/schema.prisma](prisma/schema.prisma) file.

There are two resources being used:
- `itinerary` - a trip is represented with a singular `itinerary` resource. It consists of a `name`, a `startDate`, an `endDate`,
   an optional `description` and multiple `dayPlan` resources.
- `dayPlan` - an `itinerary` may have multiple `dayplan` resources. Each `dayPlan` has a `date`, a `title` and an optional
  `description`. When an `itinerary` object is deleted, all associated `dayPlan` resources must be automatically deleted.

## API

The utility `next-list` was used to quickly list all the endpoints.

| Method | Route                                                      | Description                                                                                                                                                                  |
|--------|------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | /api/itineraries/route                                     | Get all the `itinerary` resources.                                                                                                                                           |
| POST   | /api/itineraries/route                                     | Create a new `itinerary` resource. Auto-generates `dayPlan`, based on the difference between `startDate` and `endDate`.                                                      |
| GET    | /api/itineraries/[itineraryId]/route                       | Get a single `itinerary` resource, based on the parameter `itineraryId`. Returning data includes the `dayPlan` resources in addition to the `itinerary` resource.            |
| PUT    | /api/itineraries/[itineraryId]/route                       | Update a single `itinerary` resource, based on the parameter `itineraryId`. Returning data includes the `dayPlan` resources in addition to the updated `itinerary` resource. |
| DELETE | /api/itineraries/[itineraryId]/route                       | Delete a single `itinerary` resource, based on the parameter `itineraryId`.                                                                                                  |
| POST   | /api/itineraries/[itineraryId]/day-plans/route             | Create a new `dayPlan` resource, based on the parameter `itineraryId`.                                                                                                       |
| PUT    | /api/itineraries/[itineraryId]/day-plans/[dayPlanId]/route | Update a single `dayPlan` resource, based on the parameter `itineraryId` and `dayPlanId`. Returning data includes the updated `dayPlan` resource.                            |
| DELETE | /api/itineraries/[itineraryId]/day-plans/[dayPlanId]/route | Delete a single `dayPlan` resource, based on the parameter `itineraryId` and `dayPlanId`.                                                                                    |
