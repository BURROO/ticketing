import mongoose from 'mongoose';
import { reduceEachLeadingCommentRange } from 'typescript';
import { Password } from '../services/password'

// An interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string,
  password: string
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  // Defined what is returned to/by? client
  toJSON: {
    // versionKey: false, // same as delete ret.__v;
    // View LEVEL LOCIC, not best approach!
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id; 
      delete ret.password;
      delete ret.__v;
    }
  }
});

// oldstyle functions to make access of this
userSchema.pre('save', async function(done) {
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed)
  }
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// const user = User.build({
//   email: 'test@test.com',
//   password: 'password'
// })
// user.email

export { User }; 