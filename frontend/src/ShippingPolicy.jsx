import React from 'react';

function ShippingPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Shipping Policy</h1>
                    <p className="mt-4 text-lg text-gray-500">Last updated: August 27, 2025</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md prose prose-lg max-w-none">
                    <h2>Order Processing</h2>
                    <p>
                        All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has been shipped.
                    </p>

                    <h2>Third-Party Delivery Facility</h2>
                    <p>
                        SecondBooks does not have its own delivery facility. We partner with reputable third-party courier services (such as Delhivery, Blue Dart, etc.) to ship all orders. By placing an order on our website, you acknowledge and agree that the delivery of your items will be handled by one of these external partners.
                    </p>

                    <h2>Shipping Timelines</h2>
                    <p>
                        Estimated delivery times are typically between 5-7 business days, but this can vary depending on your location and the operational capacity of our courier partners. The delivery timelines provided are estimates and cannot be guaranteed.
                    </p>

                    <h2>Tracking Your Order</h2>
                    <p>
                        Once your order has been shipped, you will receive an email from us which will include a tracking number and a link to the courier's website. You can use this information to track the status of your delivery. Please allow 24-48 hours for the tracking information to become available.
                    </p>
                    
                    <h2>Our Responsibility</h2>
                    <p>
                        Our responsibility for the product ceases once the package is handed over to our third-party courier partner. We are not liable for any delays, damages, or loss of packages during transit. However, we will do our best to assist you in coordinating with the courier service in case of any issues.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about your order's shipping status, please do not hesitate to contact us at <a href="mailto:support@secondbooks.online" className="text-blue-600 hover:underline">support@secondbooks.online</a> with your name and order number.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ShippingPolicy;
