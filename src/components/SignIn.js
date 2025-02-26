// import { /*useState*/ } from "react";
// import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import "./SignIn.css";

export default function SignIn() {
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
        <h2 className="title">Sign in</h2>
        <p className="subtitle">
          Welcome back! Don't have an account? <a href="" className="link">Sign up</a>
        </p>
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

          {/* Forgot Password Link */}
          <p className="forgot-password">
            <a href="#" className="link">Forgot your password?</a>
          </p>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
}
