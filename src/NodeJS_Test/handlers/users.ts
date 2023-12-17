// CommonJS Module
const redis = require('../lib/redis');

export interface ExReq extends Response {
  params: any;
};

const getUser = async (req: ExReq) => {
  const key: string = `users:${req.params.id}`;
  // Promise<Reject>を返すとそのまま, throw Errorを上位にロールバックする
  const val: string = await redis.getClient().get(key); 
  const user: JSON = JSON.parse(val);
  return user;
};

// もしgetUser関数内部のエラー処理が変わった場合(undefined)
// const getUser = async (req: ExReq) => {
//   try {
//     const key: string = `users:${req.params.id}`;
//     const val: string = await redis.getClient().get(key);
//     const user: JSON = JSON.parse(val);
//   } catch (err: any) {
//     return undefined;
//   }
// };

// // 引数にreqに加えてresを追加して, getUserがresに依存した形式
// const getUser = async (req: ExReq, res: Response) => {
//   try {
//     const key: string = `users:${req.params.id}`;
//     const val: string = await redis.getClient().get(key);
//     const user: JSON = JSON.parse(val);
//     res.status(200).json(user); // JSON -> string
//   } catch (err: any) {
//     res.status(500).send('internal error');
//   }
// };

exports.getUser = getUser;

const getUsers = async (req: Request) => {
  const stream = redis.getClient().scanStream({
    match: 'users:*',
    count: 2
  });

  const users: Array<JSON> = [];
  // AsyncIterator
  for await (const resultKeys of stream) {
    for (const key of resultKeys) {
      const value: string | null = await redis.getClient().get(key);
      const user: JSON = JSON.parse(value!);
      users.push(user);
    }
  }

  return { users: users };
};

exports.getUsers = getUsers;

// モジュール宣言
export { };