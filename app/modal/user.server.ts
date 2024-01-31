import { db } from "~/services/db.server";

export async function getOrCreateUser(userdata: any) {
  let email = userdata?._json.email;
  let picture = userdata?._json.picture;
  let username = userdata?._json.given_name;

  try {
    let user = await db.user.upsert({
      where: {
        email,
      },
      create: {
        picture,
        username,
        email,
      },
      update: {
        picture,
        username,
        email,
      },
    });
    return user;
  } catch (e) {
    throw new Error(e + "user not found");
  }
}

export async function getUser(email: string) {
  return await db.user.findFirst({
    where: { email },
  });
}

export async function getUsers(value: string) {
  const totalCount = await db.user.count();
  const list = await db.user.findMany({
    where: {
      OR: [{ username: { contains: value } }, { email: { contains: value } }],
    },
    take: 30,
  });
  return { list, totalCount };
}