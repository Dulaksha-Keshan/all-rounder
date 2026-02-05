import Link from "next/link";
import { ArrowRight, Star, GraduationCap, User, School, Building2 } from "lucide-react";

const userTypes = [
  {
    type: "student",
    title: "Student",
    description: "Access learning resources and track your progress",
    icon: GraduationCap,
    features: [
      "Join classes",
      "Access materials",
      "Track performance",
    ],
    color: "from-[#8387CC] to-[#4169E1]",
    borderColor: "border-[#8387CC]",
    hoverColor: "hover:border-[#4169E1]",
  },
  {
    type: "teacher",
    title: "Teacher",
    description: "Manage classes and guide students effectively",
    icon: User,
    features: [
      "Create classes",
      "Upload materials",
      "Monitor students",
    ],
    color: "from-[#4169E1] to-[#34365C]",
    borderColor: "border-[#4169E1]",
    hoverColor: "hover:border-[#34365C]",
  },
  {
    type: "school",
    title: "School",
    description: "Oversee teachers and students in one place",
    icon: School,
    features: [
      "Manage teachers",
      "View analytics",
      "Approve students",
    ],
    color: "from-[#34365C] to-[#8387CC]",
    borderColor: "border-[#34365C]",
    hoverColor: "hover:border-[#8387CC]",
  },
  {
    type: "organization",
    title: "Organization",
    description: "Partner with institutions and manage programs",
    icon: Building2,
    features: [
      "Create programs",
      "Collaborate with schools",
      "Track engagement",
    ],
    color: "from-[#8387CC] to-[#34365C]",
    borderColor: "border-[#8387CC]",
    hoverColor: "hover:border-[#34365C]",
  },
];

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FF] via-white to-[#F8F8FF] py-12 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 relative">
            <Star className="absolute top-0 right-1/4 w-8 h-8 text-[#DCD0FF] opacity-50 animate-pulse" />
            <Star
                className="absolute bottom-0 left-1/4 w-6 h-6 text-[#8387CC] opacity-40 animate-pulse"
                style={{ animationDelay: "0.5s" }}
            />

            <h1 className="text-[#34365C] mb-4">Join All-Rounder</h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                Choose your account type to get started on your journey
            </p>
            </div>

            {/* User Type Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {userTypes.map((userType) => {
                const Icon = userType.icon;

                return (
                <Link
                    key={userType.type}
                    href={`/signUp/${userType.type}`}
                    className={`bg-white rounded-xl border-2 ${userType.borderColor} p-6 hover:shadow-2xl ${userType.hoverColor} transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                    {/* Icon */}
                    <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${userType.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                    <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[#34365C] mb-2">{userType.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">
                    {userType.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                    {userType.features.map((feature, index) => (
                        <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                        >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8387CC] mt-1.5 flex-shrink-0" />
                        <span>{feature}</span>
                        </li>
                    ))}
                    </ul>

                    {/* CTA */}
                    <div
                    className={`flex items-center justify-between text-sm bg-gradient-to-r ${userType.color} text-white px-4 py-3 rounded-lg group-hover:shadow-lg transition`}
                    >
                    <span>Sign up as {userType.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
                );
            })}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
            <h3 className="text-[#34365C] mb-4 text-center">
                Already have an account?
            </h3>
            <p className="text-gray-600 text-center mb-6">
                If you've already created your All-Rounder account, you can log in to
                access your dashboard.
            </p>
            <div className="flex justify-center">
                <Link
                href="/login"
                className="px-6 py-3 bg-[#4169E1] hover:bg-[#3557c1] text-white rounded-lg transition inline-flex items-center gap-2"
                >
                Go to Login
                <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 bg-gradient-to-r from-[#8387CC]/10 to-[#4169E1]/10 border border-[#8387CC]/30 rounded-xl p-6 max-w-3xl mx-auto">
            <h4 className="text-[#34365C] mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#8387CC]" />
                Important Information
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8387CC] mt-2 flex-shrink-0" />
                <span>
                    <strong>Students:</strong> Your account will need approval from a
                    verified teacher
                </span>
                </li>
                <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8387CC] mt-2 flex-shrink-0" />
                <span>
                    <strong>Teachers:</strong> You'll need to provide employment
                    verification documents
                </span>
                </li>
                <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8387CC] mt-2 flex-shrink-0" />
                <span>
                    <strong>Schools:</strong> Official documentation will be required
                    for verification
                </span>
                </li>
                <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8387CC] mt-2 flex-shrink-0" />
                <span>
                    <strong>Organizations:</strong> Registration details will be
                    verified before approval
                </span>
                </li>
            </ul>
            </div>
        </div>
        </div>
  );
}
