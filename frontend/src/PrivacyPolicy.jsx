import React from 'react';

function PrivacyPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
                    <p className="mt-4 text-lg text-gray-500">Last updated: August 27, 2025</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md prose prose-lg max-w-none">
                    <p>
                        SecondBooks ("us", "we", or "our") operates the secondbooks.online website (the "Service").
                        This page informs you of our policies regarding the collection, use, and disclosure of personal
                        data when you use our Service and the choices you have associated with that data.
                    </p>

                    <h2>1. Information Collection and Use</h2>
                    <p>
                        We collect several different types of information for various purposes to provide and improve our
                        Service to you.
                    </p>
                    <h3>Types of Data Collected</h3>
                    <ul>
                        <li>
                            <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with
                            certain personally identifiable information that can be used to contact or identify you
                            ("Personal Data"). This may include, but is not limited to: Email address, First name and last name,
                            Phone number, Address, State, Province, ZIP/Postal code, City.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and
                            used ("Usage Data"). This Usage Data may include information such as your computer's Internet
                            Protocol address (e.g. IP address), browser type, browser version, the pages of our Service
                            that you visit, the time and date of your visit, the time spent on those pages, unique
                            device identifiers and other diagnostic data.
                        </li>
                    </ul>

                    <h2>2. Use of Cookies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track the activity on our Service and hold
                        certain information. Cookies are files with a small amount of data which may include an anonymous
                        unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie
                        is being sent. However, if you do not accept cookies, you may not be able to use some portions of
                        our Service.
                    </p>

                    <h2>3. How We Use Your Data</h2>
                    <p>
                        SecondBooks uses the collected data for various purposes:
                    </p>
                    <ul>
                        <li>To provide and maintain our Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To process your orders and manage your account</li>
                        <li>To provide customer support</li>
                        <li>To gather analysis or valuable information so that we can improve our Service</li>
                        <li>To monitor the usage of our Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h2>4. Data Security</h2>
                    <p>
                        The security of your data is important to us but remember that no method of transmission over the
                        Internet or method of electronic storage is 100% secure. While we strive to use commercially
                        acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>

                    <h2>5. Third-Party Services</h2>
                    <p>
                        We may employ third-party companies and individuals to facilitate our Service ("Service Providers"),
                        such as payment gateways and delivery partners. These third parties have access to your Personal
                        Data only to perform these tasks on our behalf and are obligated not to disclose or use it for
                        any other purpose.
                    </p>

                    <h2>6. Children's Privacy</h2>
                    <p>
                        Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect
                        personally identifiable information from anyone under the age of 18. If you are a parent or guardian
                        and you are aware that your Children has provided us with Personal Data, please contact us.
                    </p>

                    <h2>7. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting
                        the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically
                        for any changes.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@secondbooks.online" className="text-blue-600 hover:underline">support@secondbooks.online</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
