import Post from '../../../../lib/models/post.model.js';
import { connect } from '../../../../lib/mongodb/mongoose.js';
import { currentUser, clerkClient } from '@clerk/nextjs/server';
import User from '../../../../lib/models/user.model.js'; // Assure-toi que ce modèle existe

console.log("Received request at /api/post/create");

export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();

    // Vérifier si userMongoId est manquant dans Clerk
    let userMongoId = user?.publicMetadata?.userMongoId;

    if (!userMongoId) {
      console.log("❌ userMongoId is missing. Fetching from database...");

      // Trouver l'utilisateur dans la base MongoDB via l'email ou username
      let dbUser = await User.findOne({ email: user.emailAddresses[0].emailAddress });

      // Si l'utilisateur n'existe pas en base, le créer
      if (!dbUser) {
        dbUser = new User({ username: user.username, email: user.emailAddresses[0].emailAddress });
        await dbUser.save();
      }

      userMongoId = dbUser._id.toString();

      // Mettre à jour Clerk avec userMongoId
      await clerkClient.users.updateUser(user.id, {
        publicMetadata: { userMongoId },
      });

      console.log("✅ userMongoId ajouté à Clerk:", userMongoId);
    }

    console.log("Received data:", data);
    console.log("userMongoId received:", userMongoId);

    const newPost = await Post.create({
      user: userMongoId,
      name: data.name,
      username: data.username,
      text: data.text,
      profileImg: data.profileImg,
      image: data.image,
    });

    await newPost.save();
    return new Response(JSON.stringify(newPost), { status: 200 });

  } catch (error) {
    console.log('Error creating post:', error);
    return new Response('Error creating post', { status: 500 });
  }
};
