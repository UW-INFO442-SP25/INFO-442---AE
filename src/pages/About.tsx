
import { Layout } from "@/components/layout";

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              We're a team of students committed to making internship interviews more transparent 
              and accessible for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-primary">JS</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">John Smith</h3>
              <p className="text-gray-600">Full Stack Developer</p>
              <p className="text-gray-500 mt-2">Stanford University '24</p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-primary">AD</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Alice Davis</h3>
              <p className="text-gray-600">UI/UX Designer</p>
              <p className="text-gray-500 mt-2">MIT '25</p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-24 w-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-primary">MK</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Michael Kim</h3>
              <p className="text-gray-600">Product Manager</p>
              <p className="text-gray-500 mt-2">UC Berkeley '24</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We believe in creating equal opportunities for all students seeking internships. 
              By making interview experiences transparent and accessible, we're working towards 
              United Nations Sustainable Development Goal 8: promoting decent work and economic 
              growth for everyone.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
