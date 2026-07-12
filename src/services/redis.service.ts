import { createClient } from "redis";

class RedisService {
  private client = createClient({
    url: process.env.REDIS_URL,
  });

  async connect() {
    await this.client.connect();
  }

  async set(key: string, value: unknown, ttl?: number) {
    const serialized = JSON.stringify(value);

    if (ttl) {
      await this.client.set(key, serialized, { EX: ttl });
      return;
    }

    await this.client.set(key, serialized);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    return value ? (JSON.parse(value) as T) : null;
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async exists(key: string) {
    return (await this.client.exists(key)) === 1;
  }
}

export default RedisService;