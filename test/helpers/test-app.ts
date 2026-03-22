import { INestApplication } from "@nestjs/common";
import { TestingModuleBuilder } from "@nestjs/testing";
import { configureApp } from "../../src/app.factory";

export async function createTestApp(
  builder: TestingModuleBuilder,
): Promise<INestApplication> {
  const moduleRef = await builder.compile();
  const app = configureApp(moduleRef.createNestApplication());
  await app.init();
  return app;
}
