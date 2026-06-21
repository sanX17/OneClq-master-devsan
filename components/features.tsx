import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Brain, Gift, Smartphone, Zap } from "lucide-react";
import { APPNAME } from "@/lib/constant";

const Features = () => {
  return (
    <section className="py-20 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-green-700 text-md font-semibold">
            Powered by AI
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 mt-4">
            Revolutionizing How India Shops, Pays & Saves
          </h2>
          <p className="text-sm lg:text-md text-gray-500 max-w-4xl mx-auto">
            Empowering every Indian with a smart, multilingual super app to
            compare prices, shop D2C, pay bills, and access services — all with
            AI-driven simplicity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="col-span-2 group bg-linear-to-br from-green-100 via-purple-100 to-purple-200 hover:scale-105 hover:text-green-800 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500 group-hover:rotate-12 transition-transform duration-300 text-white rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl">
                One App. Endless Possibilities.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                From fashion to food, recharge to rent — {APPNAME} makes
                everyday tasks faster, cheaper, and smarter with everything in
                one place.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="col-span-2 lg:col-span-1 lg:row-span-2 group bg-linear-to-br from-green-100 via-purple-100 to-purple-200 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500 group-hover:rotate-12 transition-transform duration-300 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                Smart Shopping, Fast Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Powered by real-time AI and marketplace integrations, {APPNAME}
                finds you the best deals instantly — boosting savings and
                simplifying choices.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="col-span-2 lg:col-span-1 group bg-linear-to-br from-green-100 via-purple-100 to-purple-200 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500 group-hover:rotate-12 transition-transform duration-300 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                AI That Gets You More for Less
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Our intelligent engine learns your preferences to recommend
                top-rated products, better prices, and local services — all
                while reducing your search effort.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="mb-10 lg:mb-0 col-span-2 lg:col-span-1 group bg-linear-to-br from-green-100 via-purple-100 to-purple-200 hover:scale-105 transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500 group-hover:rotate-12 transition-transform duration-300 rounded-lg flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Earn While You Explore</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Get reward points, cashbacks, and exclusive deals every time you
                shop, pay bills, or refer friends through {APPNAME}.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
