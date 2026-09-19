
const Footer = () => {
  return (
      <footer className="bg-slate-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} الفتح لخامات المنظفات. جميع الحقوق محفوظة.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            العنوان: القاهرة، جمهورية مصر العربية | هاتف: 01010061178
          </p>
        </div>
      </footer>
  )
}

export default Footer
