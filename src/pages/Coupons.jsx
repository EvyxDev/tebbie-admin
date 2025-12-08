import { useState, useMemo, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import {
  deleteCoupon,
  getCoupons,
  UpdateCoupon,
  newCoupon,
} from "../utlis/https";
import { RiCoupon2Fill } from "react-icons/ri";
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from "react-icons/ai";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Switch,
} from "@mui/material";
import {
  hasPermission,
  getPermissionDisplayName,
} from "../utlis/permissionUtils";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

const token = localStorage.getItem("authToken");

const Coupons = () => {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formState, setFormState] = useState({
    code: "",
    type: "fixed",
    amount: "",
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [updatedCoupon, setUpdatedCoupon] = useState({
    code: "",
    type: "",
    amount: "",
    status: 1,
    max_used: "",
    expire_date: "",
  });

  const couponsPerPage = 5;

  const {
    data: couponData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Coupons", token],
    queryFn: () => getCoupons({ token }),
  });
  const { mutate: handleUpdate } = useMutation({
    mutationFn: ({
      id,
      token,
      code,
      type,
      amount,
      status,
      max_used,
      expire_date,
      originalCoupon,
    }) => {
      if (!hasPermission("coupons-update")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "coupons-update"
          )}`
        );
      }
      return UpdateCoupon({
        id,
        token,
        code,
        type,
        amount,
        status,
        max_used,
        expire_date,
        originalCoupon,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["Coupons", token]);
      setEditingCoupon(null);
      toast.success(t("couponUpdatedSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
      toast.error(t("couponUpdateFailed", { error: error.message }));
    },
  });

  const { mutate: handleAdd } = useMutation({
    mutationFn: ({ code, type, amount }) => {
      if (!hasPermission("coupons-store")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "coupons-store"
          )}`
        );
      }
      return newCoupon({ code, type, amount, token });
    },
    onMutate: async ({ code, type, amount }) => {
      await queryClient.cancelQueries(["Coupons", token]);
      const previousCoupons = queryClient.getQueryData(["Coupons", token]);
      const newCouponData = { id: `temp-${Date.now()}`, code, type, amount };
      queryClient.setQueryData(["Coupons", token], (oldCoupons) => [
        ...(oldCoupons || []),
        newCouponData,
      ]);
      setFormState({ code: "", type: "fixed", amount: "" });
      return { previousCoupons };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["Coupons", token], context.previousCoupons);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(t("couponAddedSuccess"));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["Coupons", token]);
    },
  });

  const { mutate: handleDelete } = useMutation({
    mutationFn: ({ id }) => {
      if (!hasPermission("coupons-destroy")) {
        throw new Error(
          `You don't have permission to ${getPermissionDisplayName(
            "coupons-destroy"
          )}`
        );
      }
      return deleteCoupon({ id, token });
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(["Coupons", token]);
      const previousCoupons = queryClient.getQueryData(["Coupons", token]);
      queryClient.setQueryData(["Coupons", token], (oldCoupons) =>
        oldCoupons.filter((coupon) => coupon.id !== id)
      );
      return { previousCoupons };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["Coupons", token], context.previousCoupons);
      toast.error(t("couponDeleteFailed", { error: error.message }));
    },
    onSuccess: () => {
      toast.success(t("couponDeletedSuccess"));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["Coupons", token]);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddClick = () => {
    const { code, type, amount } = formState;
    if (code.trim() && amount) {
      handleAdd({ code, type, amount });
    } else {
      toast.error(t("fillAllFields"));
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      handleDelete({ id: selectedId });
    }
    handleCloseDialog();
  };

  const handleEditClick = (coupon) => {
    console.log(coupon);

    setEditingCoupon(coupon.id);
    setUpdatedCoupon({
      code: coupon.code,
      type: coupon.type,
      amount: coupon.amount,
      status: coupon.status,
      max_used: coupon.max_used,
      expire_date: coupon.expire_date,
    });
  };

  const handleSaveClick = (id) => {
    const originalCoupon = couponData.find((coupon) => coupon.id === id);
    console.log("originalCoupon ", originalCoupon);
    console.log("updatedCoupon ", updatedCoupon);

    handleUpdate({ id, token, ...updatedCoupon, originalCoupon });
  };

  const filterByDateRange = useCallback(
    (cards) => {
      if (!dateFrom && !dateTo) return cards;

      return cards.filter((card) => {
        if (!card.expire_date) return false;

        const cardDate = new Date(card.expire_date);
        cardDate.setHours(0, 0, 0, 0);

        if (dateFrom && dateTo) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate() - 1);

          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate() + 1);

          return cardDate >= fromDate && cardDate <= toDate;
        } else if (dateFrom) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          fromDate.setDate(fromDate.getDate() - 1);
          const now = new Date();
          now.setHours(23, 59, 59, 999);

          return cardDate >= fromDate && cardDate <= now;
        } else if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          toDate.setDate(toDate.getDate() + 1);

          return cardDate <= toDate;
        }

        return true;
      });
    },
    [dateFrom, dateTo]
  );

  const filteredCoupons = useMemo(() => {
    if (!couponData) return [];
    return couponData.filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [couponData, searchTerm]);

  // Apply date range filter AFTER search filter
  const filteredByDate = useMemo(() => {
    return filterByDateRange(filteredCoupons);
  }, [filteredCoupons, filterByDateRange]);

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;

  const currentCoupons = filteredByDate.slice(
    indexOfFirstCoupon,
    indexOfLastCoupon
  );

  const totalPages =
    filteredByDate.length > 0
      ? Math.ceil(filteredByDate.length / couponsPerPage)
      : 0;

  const handleDateFromChange = (e) => {
    setDateFrom(e.target.value);
    setCurrentPage(1);
  };

  const handleDateToChange = (e) => {
    setDateTo(e.target.value);
    setCurrentPage(1);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(couponData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Coupons");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "coupons.xlsx");
  };

  // Export ALL filtered rows (client-side filtered)

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={t("errorFetchingCoupons")} />;

  return (
    <section dir={direction} className="container mx-auto py-8">
      <div className="rounded-3xl md:p-8 p-5 bg-white overflow-auto ">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center w-full gap-4">
          <input
            type="text"
            placeholder={t("couponSearchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-[30%] p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
          />

          <div className="md:-mt-6 w-full md:w-[52%] flex gap-4 md:flex-row items-center">
            <div className="flex-1">
              <label
                htmlFor="dateFrom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("date_from")}
              </label>
              <input
                type="date"
                id="dateFrom"
                value={dateFrom}
                onChange={handleDateFromChange}
                className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="dateTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("date_to")}
              </label>
              <input
                type="date"
                id="dateTo"
                value={dateTo}
                onChange={handleDateToChange}
                className="w-full p-2 border border-gray-300 rounded-lg py-3 px-4 bg-white h-[50px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="w-full md:w-[15%] text-end">
            <button
              onClick={exportToExcel}
              className="px-5 w-full md:w-auto py-2.5 hover:bg-[#048c87] flex justify-center items-center text-white gap-2 bg-gradient-to-bl from-[#33A9C7] to-[#3AAB95] text-md rounded-[8px] focus:outline-none text-center"
            >
              {t("coupon_excel_export")}
              <span>
                <FileSpreadsheet />
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto md:w-full w-[90vw]">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-center">#</th>
                <th className="py-3 px-6 text-center">{t("code")}</th>
                <th className="py-3 px-6 text-center">{t("type")}</th>
                <th className="py-3 px-6 text-center">{t("amount")}</th>
                <th className="py-3 px-6 text-center">
                  {t("coupon_status")}
                </th>{" "}
                <th className="py-3 px-6 text-center">{t("max_usage")}</th>{" "}
                <th className="py-3 px-6 text-center">{t("expire_date")}</th>{" "}
                <th className="py-3 px-6 text-center">{t("Actions")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-lg font-light">
              {currentCoupons.length === 0 && searchTerm && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    {t("noCouponsFound")}
                  </td>
                </tr>
              )}
              {currentCoupons.map((coupon, index) => (
                <tr
                  key={coupon.id}
                  className={`border-b border-gray-200 hover:bg-gray-100 ${
                    coupon.id.toString().startsWith("temp-") ? "opacity-50" : ""
                  }`}
                >
                  <td className="py-3 px-6 text-center flex items-center justify-center gap-3">
                    {indexOfFirstCoupon + index + 1}
                    <RiCoupon2Fill />
                  </td>
                  <td className="py-3 px-6 text-center">
                    {editingCoupon === coupon.id ? (
                      <input
                        type="text"
                        value={updatedCoupon.code}
                        onChange={(e) =>
                          setUpdatedCoupon((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    ) : (
                      <Link
                        to={`/coupons/${coupon.id}`}
                        className="text-blue-500"
                      >
                        {coupon.code}
                      </Link>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {editingCoupon === coupon.id ? (
                      <select
                        value={updatedCoupon.type}
                        onChange={(e) =>
                          setUpdatedCoupon((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      >
                        <option value="fixed">{t("fixed")}</option>
                        <option value="percentage">{t("percentage")}</option>
                      </select>
                    ) : coupon.type === "fixed" ? (
                      t("fixed")
                    ) : (
                      t("percentage")
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {editingCoupon === coupon.id ? (
                      <input
                        type="number"
                        value={updatedCoupon.amount}
                        onChange={(e) =>
                          setUpdatedCoupon((prev) => ({
                            ...prev,
                            amount: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    ) : (
                      coupon.amount
                    )}
                  </td>
                  {/* status */}
                  <td className="py-3 px-6 text-center">
                    <Switch
                      checked={
                        editingCoupon === coupon.id
                          ? Boolean(Number(updatedCoupon.status))
                          : Boolean(Number(coupon.status))
                      }
                      onChange={(e) => {
                        if (editingCoupon !== coupon.id) return;

                        setUpdatedCoupon((prev) => ({
                          ...prev,
                          status: e.target.checked ? 1 : 0,
                        }));
                      }}
                      color="primary"
                      disabled={editingCoupon !== coupon.id}
                    />
                  </td>

                  {/* max_usage */}
                  <td className="py-3 px-6 text-center">
                    {editingCoupon === coupon.id ? (
                      <input
                        type="number"
                        min="0"
                        value={updatedCoupon.max_used ?? ""}
                        onChange={(e) =>
                          setUpdatedCoupon((prev) => ({
                            ...prev,
                            max_used: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    ) : (
                      coupon.max_used
                    )}
                  </td>

                  {/* expire date */}

                  <td className="py-3 px-6 text-center">
                    {editingCoupon === coupon.id ? (
                      <input
                        type="date"
                        value={
                          updatedCoupon.expire_date
                            ? updatedCoupon.expire_date.split("T")[0]
                            : ""
                        }
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) =>
                          setUpdatedCoupon((prev) => ({
                            ...prev,
                            expire_date: e.target.value,
                          }))
                        }
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                    ) : coupon.expire_date ? (
                      new Date(coupon.expire_date).toLocaleDateString(
                        i18n.language,
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    ) : (
                      <>{i18n.language === "ar" ? "لا يوجد" : "null"}</>
                    )}
                  </td>

                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center gap-4">
                      {editingCoupon === coupon.id ? (
                        <>
                          {hasPermission("coupons-update") && (
                            <button
                              onClick={() => handleSaveClick(coupon.id)}
                              className="text-green-500 hover:text-green-700 focus:outline-none"
                            >
                              {t("save")}
                            </button>
                          )}
                          <button
                            onClick={() => setEditingCoupon(null)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {t("cancel")}
                          </button>
                        </>
                      ) : (
                        <>
                          {hasPermission("coupons-update") && (
                            <button
                              onClick={() => handleEditClick(coupon)}
                              className="text-blue-500 hover:text-blue-700 focus:outline-none"
                            >
                              <AiFillEdit size={28} />
                            </button>
                          )}
                          {hasPermission("coupons-destroy") && (
                            <button
                              onClick={() => handleDeleteClick(coupon.id)}
                              className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                              <AiFillDelete size={28} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {hasPermission("coupons-store") && (
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-center">{t("new")}</td>
                  <td className="py-3 px-6 text-center shrink-0  min-w-48">
                    <input
                      type="text"
                      name="code"
                      placeholder={t("enterCode")}
                      value={formState.code}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-center shrink-0  min-w-48">
                    <select
                      name="type"
                      value={formState.type}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value="fixed">{t("fixed")}</option>
                      <option value="percentage">{t("percentage")}</option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center shrink-0 min-w-48">
                    <input
                      type="number"
                      name="amount"
                      placeholder={t("enterAmount")}
                      value={formState.amount}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded p-2 w-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-center shrink-0  min-w-48">
                    <button
                      onClick={handleAddClick}
                      className="text-green-500 hover:text-green-700 focus:outline-none"
                    >
                      <AiFillPlusCircle size={28} />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and Total */}
        <div className="flex justify-between items-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
          />
          <p className="lg:text-2xl text-xl text-gray-500 text-end">
            {t("Total")}: {filteredCoupons.length}
          </p>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{ sx: { borderRadius: "12px", padding: "16px" } }}
        >
          <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {t("confirmDelete")}
          </DialogTitle>
          <DialogContent>
            <p className="text-gray-600">{t("areYouSureDeleteCoupon")}</p>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", gap: "16px" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "#3AAB95",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#33A9C7" },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleConfirmDelete}
              sx={{
                backgroundColor: "#DC3545",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#a71d2a" },
              }}
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </section>
  );
};

export default Coupons;
