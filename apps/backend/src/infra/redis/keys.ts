export class RedisKeyFactory {
  private readonly namespace = "business";

  users = {
    byId: (id: string) => `${this.namespace}:users:id:${id}`,
  };
}
