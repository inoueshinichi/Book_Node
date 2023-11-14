import redis from "../lib/redis";


const getUser = async (req) => {
  const key: string = `users:${req.params.id}`;
  const val: string = await redis.getClient().get(key);
  const user: string = JSON.parse(val);
  return user;
};

exports.getUser = getUser;

const getUsers = async (req) => {
  const stream: Stream = redis.getClient().scanStream({
    match: 'users:*',
    count: 2
  });

  const users: Array<JSON> = [];
  // AsyncIterator
  for await (const resultKeys of stream) {
    for (const key of resultKeys) {
      const value: string | null = await redis.client.get(key);
      const user: JSON = JSON.parse(value!);
      users.push(user);
    }
  }

  return { users: users };
};

exports.getUsers = getUsers;

