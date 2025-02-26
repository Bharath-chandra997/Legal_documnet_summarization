// import { /*useState*/ } from "react";
// import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import "./SignUp.css";

export default function SignUp() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();

  // const [showPassword, setShowPassword] = useState(false);
  
  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2 className="title">Sign up</h2>
        <p className="subtitle">Create an account or <a href="#" className="link">Sign in</a></p>
        <form /*onSubmit={handleSubmit(onSubmit)}*/ className="form">
          {/* Email Field */}
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              /*{...register("email", { required: "Email is required" })}*/
              className="input"
            />
            {/* {errors.email && <p className="error">{errors.email.message}</p>} */}
          </div>

          {/* Username Field */}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              /*{...register("username", { required: "Username is required" })}*/
              className="input"
            />
            {/* {errors.username && <p className="error">{errors.username.message}</p>} */}
          </div>

          {/* Password Field */}
          <div className="form-group relative">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                /*{...register("password", { required: "Password is required" })}*/
                className="input"
              />
              <button
                type="button"
                /*onClick={() => setShowPassword(!showPassword)}*/
                className="eye-icon"
              >
                {/*{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}*/}
              </button>
            </div>
            {/* {errors.password && <p className="error">{errors.password.message}</p>} */}
          </div>

          {/* Checkbox */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              /*{...register("marketingEmails")}*/
              className="checkbox"
            />
            <label>
              I do not want to receive emails with advertising, news, suggestions or marketing promotions
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
          >
            Sign up
          </button>
        </form>
        <p className="terms">
          By signing up to create an account, you are accepting our <a href="#" className="link">terms of service</a> and <a href="#" className="link">privacy policy</a>
        </p>
      </div>
    </div>
  );
}
