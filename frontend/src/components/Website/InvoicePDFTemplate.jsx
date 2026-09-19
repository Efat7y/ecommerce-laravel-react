import React from "react";

export default function InvoicePDFTemplate({ order, settings }) {
  if (!order) return null;

  return (
    <div
      id="pdf-invoice-template"
      style={{
        padding: "40px",
        backgroundColor: "#ffffff",
        color: "#111827",
        fontFamily: "sans-serif",
        direction: "rtl",
        width: "800px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {settings?.logo_base64 || settings?.logo ? (
            <img
              src={settings.logo_base64 ? settings.logo_base64 : `http://127.0.0.1:8000${settings.logo}`}
              alt="Logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
          ) : (
            <div
              style={{
                height: "60px",
                width: "60px",
                backgroundColor: "#2563eb",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: "bold",
                fontSize: "24px",
              }}
            >
              {settings?.site_name?.charAt(0) || "F"}
            </div>
          )}
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "0 0 5px 0",
                color: "#111827",
              }}
            >
              {settings?.vendor_name || settings?.site_name || "الفتح للمنظفات"}{" "}
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              {settings?.vendor_address || settings?.site_description || "متجر خامات كيميائية ومنظفات"}
            </p>
            {settings?.commercial_record && (
              <p style={{ fontSize: "12px", color: "#9ca3af", margin: "5px 0 0 0" }}>
                س.ت: {settings.commercial_record}
              </p>
            )}
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#d1d5db",
              textTransform: "uppercase",
              margin: "0 0 10px 0",
              letterSpacing: "2px",
            }}
          >
            INVOICE
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              margin: "0 0 5px 0",
              color: "#374151",
            }}
          >
            رقم الفاتورة: #{order.id}
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
            التاريخ: {new Date(order.created_at).toLocaleDateString("ar-EG")}
          </p>
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div style={{ width: "48%" }}>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#9ca3af",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            بيانات العميل
          </h3>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#111827",
              margin: "0 0 5px 0",
            }}
          >
            {order.user?.name || "عميل محذوف"}
          </p>
          <p
            style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 5px 0" }}
          >
            {order.phone || order.user?.phone}
          </p>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
            {order.shipping_address || "لم يتم تحديد عنوان"}
          </p>
        </div>
        <div style={{ width: "48%" }}>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#9ca3af",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            تفاصيل الدفع
          </h3>
          <p
            style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 5px 0" }}
          >
            <span
              style={{
                fontWeight: "bold",
                display: "inline-block",
                width: "90px",
              }}
            >
              طريقة الدفع:
            </span>
            {order.payment_method === "cash"
              ? "نقدي عند الاستلام"
              : "آجل (على الحساب)"}
          </p>
          <p
            style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 5px 0" }}
          >
            <span
              style={{
                fontWeight: "bold",
                display: "inline-block",
                width: "90px",
              }}
            >
              حالة الطلب:
            </span>
            {order.status === "pending"
              ? "جاري التجهيز"
              : order.status === "completed"
                ? "تم التسليم"
                : "ملغي"}
          </p>
          {order.notes && (
            <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
              <span
                style={{
                  fontWeight: "bold",
                  display: "inline-block",
                  width: "90px",
                }}
              >
                ملاحظات:
              </span>
              {order.notes}
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "40px",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f3f4f6",
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#374151",
                width: "50px",
              }}
            >
              م
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "right",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              اسم الصنف
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              الكمية
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "center",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              سعر الوحدة
            </th>
            <th
              style={{
                padding: "12px",
                textAlign: "left",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              الإجمالي
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                {index + 1}
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "right",
                  fontWeight: "bold",
                  color: "#1f2937",
                }}
              >
                {item.product?.name || "منتج محذوف"}
                {item.product?.unit && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginRight: "8px",
                    }}
                  >
                    ({item.product.unit})
                  </span>
                )}
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#4b5563",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "center",
                  color: "#4b5563",
                }}
              >
                {parseFloat(item.price).toLocaleString()} ج.م
              </td>
              <td
                style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                {parseFloat(item.total_price).toLocaleString()} ج.م
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "20px",
          borderTop: "2px solid #e5e7eb",
        }}
      >
        <div>
          {(settings?.support_phone || settings?.whatsapp_number) && (
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                margin: "0 0 5px 0",
              }}
            >
              📞 الدعم الفني: <span dir="ltr">{settings.support_phone || settings.whatsapp_number}</span>
            </p>
          )}
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
            شكراً لثقتكم بنا.
          </p>
        </div>

        <div style={{ width: "280px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              color: "#4b5563",
            }}
          >
            <span>المجموع الفرعي:</span>
            <span style={{ fontWeight: "bold" }}>
              {parseFloat(order.subtotal || 0).toLocaleString()} ج.م
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              color: "#4b5563",
            }}
          >
            <span>مصاريف الشحن:</span>
            <span style={{ fontWeight: "bold" }}>
              {order.shipping_fee > 0
                ? `${parseFloat(order.shipping_fee).toLocaleString()} ج.م`
                : "0 ج.م"}
            </span>
          </div>
          {order.discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#059669",
              }}
            >
              <span>الخصم المطبق:</span>
              <span style={{ fontWeight: "bold" }}>
                -{parseFloat(order.discount).toLocaleString()} ج.م
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}
            >
              الإجمالي النهائي:
            </span>
            <span
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}
            >
              {parseFloat(order.total || 0).toLocaleString()} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
