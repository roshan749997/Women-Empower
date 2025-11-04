'use client';
import React, { useState } from 'react';
import { MapPin, Mail, Clock } from 'lucide-react';
import { postcontactForm } from '@/app/lib/api';

const Contact = () => {
  type FormFields = {
    first_name: string;
    last_name: string;
    mobileNo: string;
    mail: string;
    msg: string;
  };

  type Errors = { [K in keyof FormFields]: string };
  type Touched = { [K in keyof FormFields]: boolean };

  const [formData, setFormData] = useState<FormFields>({
    first_name: '',
    last_name: '',
    mobileNo: '',
    mail: '',
    msg: '',
  });

  const [errors, setErrors] = useState<Errors>({
    first_name: '',
    last_name: '',
    mobileNo: '',
    mail: '',
    msg: '',
  });

  const [touched, setTouched] = useState<Touched>({
    first_name: false,
    last_name: false,
    mobileNo: false,
    mail: false,
    msg: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'first_name':
        return !value ? 'First name is required' : '';
      case 'last_name':
        return !value ? 'Last name is required' : '';
      case 'mobileNo':
        return !value
          ? 'mobileNo number is required'
          : !/^[0-9]{10}$/.test(value)
          ? 'Enter a valid 10-digit mobileNo number'
          : '';
      case 'mail':
        return !value
          ? 'mail is required'
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Invalid mail address'
          : '';
      case 'msg':
        return !value ? 'msg is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const newErrors: Errors = Object.keys(formData).reduce((acc, key) => {
      acc[key as keyof FormFields] = validateField(key, formData[key as keyof FormFields]);
      return acc;
    }, {} as Errors);

    setErrors(newErrors);
    setTouched({
      first_name: true,
      last_name: true,
      mobileNo: true,
      mail: true,
      msg: true,
    });

    const isValid = Object.values(newErrors).every(error => !error);

    if (isValid) {
      try {
        setLoading(true);
        setSubmitSuccess(false);
        
        const res = await postcontactForm(formData);
        console.log("✅ API Response:", res);

        // Show success message
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setFormData({
          first_name: '',
          last_name: '',
          mobileNo: '',
          mail: '',
          msg: '',
        });
        setTouched({
          first_name: false,
          last_name: false,
          mobileNo: false,
          mail: false,
          msg: false,
        });
        setErrors({
          first_name: '',
          last_name: '',
          mobileNo: '',
          mail: '',
          msg: '',
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);

      } catch (err: any) {
        console.error("❌ Error:", err);
        alert(err.message || "Something went wrong while submitting the form!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <section className="py-12 px-4 md:px-10 bg-[#f7f7f7] text-[#5C452B]">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 items-stretch">
        
        {/* Left: Contact Info */}
        <div className="p-8 bg-[#f7f7f7] space-y-6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">Contact Info</h2>

          <div>
            <h3 className="flex items-center font-semibold mb-1">
              <MapPin className="mr-2 text-black w-4 h-4" /> Address
            </h3>
            <p className="text-sm leading-relaxed">
              Jalaram Trading Company <br />
              Opp Hanuman Mandir, Main Mondha Golai Market <br />
              Parli Vaijnath 431515, Dist. Beed, Maharashtra
            </p>
          </div>

          <div>
            <h3 className="flex items-center font-semibold mb-1">
              <Mail className="mr-2 text-black w-4 h-4" /> mail
            </h3>
            <a
              href="mailto:womanempoweringjourney@gmail.com"
              className="text-sm text-blue-600 hover:underline"
            >
              womanempoweringjourney@gmail.com
            </a>
          </div>

          <div>
            <h3 className="flex items-center font-semibold mb-1">
              <Clock className="mr-2 text-black w-4 h-4" /> Hours
            </h3>
            <p className="text-sm">Mon - Sat: 9 AM – 7 PM</p>
            <p className="text-sm">Sunday: Closed</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Message sent successfully!</span>
              </div>
              <p className="text-sm mt-1">Thank you for contacting us. We'll get back to you soon.</p>
            </div>
          )}
          
          <div className="space-y-5">
            
            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name *
                </label>
                <input
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.first_name}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-1 focus:ring-[#5C452B] focus:outline-none text-sm"
                />
                {touched.first_name && errors.first_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name *
                </label>
                <input
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={formData.last_name}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-1 focus:ring-[#5C452B] focus:outline-none text-sm"
                />
                {touched.last_name && errors.last_name && (
                  <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* mobileNo */}
            <div>
              <input
                name="mobileNo"
                type="tel"
                placeholder="mobileNo Number *"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.mobileNo}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-1 focus:ring-[#5C452B] focus:outline-none text-sm"
              />
              {touched.mobileNo && errors.mobileNo && (
                <p className="text-red-600 text-xs mt-1">{errors.mobileNo}</p>
              )}
            </div>

            {/* mail */}
            <div>
              <input
                name="mail"
                type="mail"
                placeholder="mail *"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.mail}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-1 focus:ring-[#5C452B] focus:outline-none text-sm"
              />
              {touched.mail && errors.mail && (
                <p className="text-red-600 text-xs mt-1">{errors.mail}</p>
              )}
            </div>

            {/* msg */}
            <div>
              <textarea
                name="msg"
                rows={4}
                placeholder="Your msg *"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData.msg}
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-1 focus:ring-[#5C452B] focus:outline-none text-sm resize-none"
              />
              {touched.msg && errors.msg && (
                <p className="text-red-600 text-xs mt-1">{errors.msg}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-sm font-semibold py-3 rounded-md transition duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#5C452B] text-white hover:bg-[#4a361f]'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Submit Message'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
