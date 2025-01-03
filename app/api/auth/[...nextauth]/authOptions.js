import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToMongoDB from "@/utils/db";
import User from "@/models/User";
import { capitalizeFirstLetter } from "@/lib/utils";
import { sendOtpToPhone, verifyOtpFromPhone } from "@/app/api/core";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Password", type: "password" },
        phone_number: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        await connectToMongoDB();
        try {
          // console.log("Credentials received:", credentials);

          if (credentials.phone_number !== "") {
            const user = await User.findOne({
              phone_number: credentials.phone_number,
            });
            if (user) {
              if (!credentials.otp) {
                // sending OTP to the user's phone number
                const verification = await sendOtpToPhone(
                  credentials.phone_number
                );
                if (verification) {
                  throw new Error("OTP_SENT");
                } else {
                  throw new Error("Failed to send OTP");
                }
              } else {
                // verifying OTP
                const isOtpValid = await verifyOtpFromPhone(
                  credentials.phone_number,
                  credentials.otp
                );
                if (isOtpValid) {
                  return user;
                } else {
                  throw new Error("Invalid OTP");
                }
              }
            } else {
              console.error(
                "User doesn't exist with phone number:",
                credentials.phone_number
              );
              throw new Error("User doesn't exist");
            }
          } else if (credentials.email !== "") {
            const user = await User.findOne({ email: credentials.email });
            if (user && user.password) {
              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );
              if (isPasswordCorrect) {
                return user;
              } else {
                console.error(
                  "Incorrect password for email:",
                  credentials.email
                );
                throw new Error("Incorrect password");
              }
            } else {
              console.error(
                "User doesn't exist or password missing for email:",
                credentials.email
              );
              throw new Error("User doesn't exist or password missing");
            }
          }
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      await connectToMongoDB();

      if (account?.provider === "credentials") return true;

      if (account?.provider === "google") {
        try {
          const userExists = await User.findOne({ email: user?.email });

          if (!userExists) {
            const newUser = new User({
              first_name: capitalizeFirstLetter(user?.name.split(" ")[0]),
              last_name: capitalizeFirstLetter(user?.name.split(" ")[1]),
              email: user?.email,
              profile_image:
                user?.image ||
                "https://i.pinimg.com/1200x/b5/12/68/b5126803cf115b044849b64ca565a4a7.jpg" ||
                "/assets/user.png",
            });
            const savedUser = await newUser.save();
            return savedUser;
          }
          return userExists;
        } catch (error) {
          console.log("Error storing onto the db : ", error);
          return false;
        }
      }
    },
    async jwt({ token, user }) {
      if (typeof user !== "undefined") {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        await connectToMongoDB();
        if (token?.user) {
          const { email, phone_number } = token.user;

          const query = email
            ? { email }
            : phone_number
            ? { phone_number }
            : null;

          console.log("Query:", query);

          if (query) {
            await connectToMongoDB();
            const userFromDB = await User.findOne(query).lean(); // Lean for better performance
            console.log("user", userFromDB, "\ntoken: ", token);

            if (userFromDB) {
              session.user = userFromDB || {
                id: userFromDB?._id.toString(),
                email: userFromDB?.email,
                phone_number: userFromDB?.phone_number,
                first_name: userFromDB?.first_name,
                last_name: userFromDB?.last_name,
                profile_image: userFromDB?.profile_image,
              };
            } else {
              session.user = token?.user || {
                id: token?.user?.id,
                email: token?.user?.email,
                phone_number: token?.user?.phone_number,
                first_name: token?.user?.first_name,
                last_name: token?.user?.last_name,
                profile_image: token?.user?.profile_image,
              };
            }
          }
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error.message);
        return session;
      }
    },

    // async session({ session, token }) {
    //   try {
    //     await connectToMongoDB();
    //     if (token?.user && typeof token?.user !== undefined) {
    //       const { email, phone_number } = token.user;
    //       const query = email ? { email } : { phone_number };

    //       const userFromDB = await User.findOne(query); // .lean();

    //       if (userFromDB) session.user = userFromDB;
    //       else session.user = token.user;
    //     }
    //     return session;
    //   } catch (error) {
    //     console.error("Session callback error:", error);
    //     return session;
    //   }
    // },
    // async session({ session, token }) {
    //   await connectToMongoDB();

    //   if (typeof token?.user !== "undefined") {
    //     const userExists = await User.findOne({ email: token?.user?.email });
    //     if (userExists) {
    //       session.user = { authUser: token?.user, user: userExists };
    //     } else {
    //       session.user = { user: token?.user };
    //     }
    //   }
    //   return session.user;
    // },
  },
  pages: {
    signIn: "/auth/sign-in",
  },
};
