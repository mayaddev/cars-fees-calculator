<template>
    <v-container>
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">إغلاق</v-btn>
            </template>
        </v-snackbar>

        <v-card class="mb-5 elevation-3">
            <v-card-title class="bg-primary text-white">
                حاسبة ودائع السيارات
            </v-card-title>
            <v-card-text class="pt-4">
                <v-form v-model="valid" ref="form">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-combobox v-model="input.make" :items="uniqueMakes" label="ماركة السيارة (اختر أو اكتب)"
                                placeholder="ابحث أو اكتب ماركة جديدة" variant="outlined"
                                @update:model-value="onMakeChange" :rules="[v => !!v || 'مطلوب']"
                                clearable></v-combobox> </v-col>
                        <v-col cols="12" md="6">
                            <v-combobox v-model="input.model" :items="availableModels"
                                label="موديل السيارة (اختر أو اكتب)" placeholder="ابحث أو اكتب موديل جديد"
                                variant="outlined" :disabled="!input.make" :rules="[v => !!v || 'مطلوب']"
                                clearable></v-combobox> </v-col>

                        <v-col cols="12" md="4">
                            <v-select v-model="input.engineType" :items="engineTypes" label="نوع المحرك"
                                variant="outlined" :rules="[v => !!v || 'مطلوب']"
                                @update:model-value="onEngineTypeChange"></v-select>
                        </v-col>

                        <v-col cols="12" md="5">
                            <v-select v-model="input.rangeObj" :items="filteredRanges" item-title="label"
                                item-value="id" label="شريحة السعة اللترية" variant="outlined" return-object
                                :disabled="!input.engineType" :rules="[v => !!v || 'مطلوب']"
                                no-data-text="اختر نوع المحرك أولاً"></v-select>
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model.number="input.actualCapacity" label="السعة الفعلية (CC)" type="number"
                                variant="outlined" :disabled="isElectric" :rules="actualCapacityRules"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="input.year" label="سنة الصنع" type="number" variant="outlined"
                                :rules="[v => !!v || 'مطلوب']"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-text-field v-model.number="input.depositNoAg" label="الوديعة الكاملة (بدون اتفاقية)"
                                type="number" prefix="$" variant="outlined"
                                :rules="[v => v >= 0 || 'مطلوب']"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="5">
                            <v-text-field v-model.number="input.depositAg" label="الوديعة الكاملة (تطبيق اتفاقية)"
                                type="number" prefix="$" variant="outlined"
                                :rules="[v => v >= 0 || 'مطلوب']"></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" variant="text" @click="resetForm">مسح النموذج</v-btn>
                <v-btn color="primary" variant="elevated" @click="handleCalculationRequest" :disabled="!valid">
                    حساب وإضافة للجدول
                </v-btn>
                <v-btn color="success" prepend-icon="mdi-microsoft-excel" @click="exportToExcel" variant="elevated">
                    تصدير Excel
                </v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="confirmDialog.show" max-width="600">
            <v-card>
                <v-card-title class="bg-info text-white">تأكيد بيانات الحساب</v-card-title>
                <v-card-text class="pt-4">
                    <v-table density="compact">
                        <tbody>
                            <tr>
                                <td class="font-weight-bold">حالة الاتفاقية:</td>
                                <td>
                                    <v-chip :color="confirmDialog.data?.meta?.isEqual ? 'warning' : 'success'"
                                        size="small" variant="flat" class="font-weight-bold">
                                        {{ confirmDialog.data?.meta?.agreementStatusText }}
                                    </v-chip>
                                </td>
                            </tr>

                            <tr>
                                <td class="font-weight-bold">الشريحة السعرية:</td>
                                <td>{{ confirmDialog.data?.meta?.tierDescription }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">نسبة الفئة المتوسطة:</td>
                                <td>{{ confirmDialog.data?.meta?.ratioInterPercent }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">نسبة الفئة الأساسية:</td>
                                <td>{{ confirmDialog.data?.meta?.ratioBasicPercent }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">خصم سعة المحرك:</td>
                                <td>{{ confirmDialog.data?.meta?.rangeDiscountPercent }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">السعة الفعلية:</td>
                                <td>{{ input.actualCapacity || 'غير منطبق' }}</td>
                            </tr>
                            <tr>
                                <td class="font-weight-bold">حالة الاتفاقية:</td>
                                <td>
                                    <v-chip :color="confirmDialog.data?.meta?.isEqual ? 'warning' : 'success'"
                                        size="small" variant="flat" class="font-weight-bold">
                                        {{ confirmDialog.data?.meta?.agreementStatusText }}
                                    </v-chip>
                                </td>
                            </tr>
<template v-if="!confirmDialog.data?.meta?.isEqual">
      <tr class="bg-grey-lighten-4">
        <td class="text-primary font-weight-bold">معامل الفئة الأساسية (اتفاقية):</td>
        <td class="text-primary">
          {{ confirmDialog.data?.meta?.agreementCalcDescription?.basicFactor }}
        </td>
      </tr>
      <tr class="bg-grey-lighten-4">
        <td class="text-primary font-weight-bold">معامل الفئة المتوسطة (اتفاقية):</td>
        <td class="text-primary">
          {{ confirmDialog.data?.meta?.agreementCalcDescription?.interFactor }}
        </td>
      </tr>
    </template>
                        </tbody>
                    </v-table>
                    <v-alert v-if="confirmDialog.warning" type="warning" class="mt-4" variant="outlined">
                        تنبيه: الودائع النهائية للتطبيق أعلى من عدم التطبيق.
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="confirmDialog.show = false">إلغاء</v-btn>
                    <v-btn color="success" variant="elevated" @click="confirmAndAdd">تأكيد وإضافة</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-card class="elevation-3">
            <v-data-table :headers="headers" :items="store.records" class="text-right" dir="rtl">
                <template v-slot:item.fullAg="{ item }">{{ formatCurrency(item.fullAg) }}</template>
                <template v-slot:item.fullNoAg="{ item }">{{ formatCurrency(item.fullNoAg) }}</template>
                <template v-slot:item.interAg="{ item }">{{ formatCurrency(item.interAg) }}</template>
                <template v-slot:item.interNoAg="{ item }">{{ formatCurrency(item.interNoAg) }}</template>
                <template v-slot:item.basicAg="{ item }">{{ formatCurrency(item.basicAg) }}</template>
                <template v-slot:item.basicNoAg="{ item }">{{ formatCurrency(item.basicNoAg) }}</template>
                <template v-slot:item.actions="{ item }">
                    <v-btn icon="mdi-delete" size="small" color="error" variant="text"
                        @click="deleteItem(item.id)"></v-btn>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCarStore } from '@/stores/carStore';
import { carData, engineRanges, engineTypes } from '@/data/lookups';
import { calculateFees } from '@/utils/calculator';
import * as XLSX from 'xlsx';
const store = useCarStore();
const valid = ref(false);
const form = ref(null);
const snackbar = ref({ show: false, text: '', color: 'error' });
const confirmDialog = ref({ show: false, data: null, warning: false });
let pendingRecord = null;

const input = ref({
    make: null,
    model: null,
    engineType: null,
    rangeObj: null,
    actualCapacity: null,
    year: new Date().getFullYear(),
    depositNoAg: null,
    depositAg: null,
});

// 1. Logic for Lookups
const uniqueMakes = computed(() => [...new Set(carData.map(c => c.make))]);
const availableModels = computed(() => {
    if (!input.value.make) return [];
    // التعامل مع الحالة: هل المدخل نص (كتابة يدوية) أم اختيار؟
    // v-combobox قد يرجع القيمة كـ String مباشرة
    const selectedMake = input.value.make;
    return carData.filter(c => c.make === input.value.make).map(c => c.model);

});
// 2. تصفية الشرائح بناء على نوع المحرك المختار (Requirement 1)
const filteredRanges = computed(() => {
    if (!input.value.engineType) return [];
    return engineRanges.filter(range => range.engType === input.value.engineType);
});

// عند تغيير نوع المحرك، نصفر الشريحة والسعة
const onEngineTypeChange = () => {
    input.value.rangeObj = null;
    input.value.actualCapacity = null;
};

// 3. هل المحرك كهربائي؟ (لتخطي التحقق)
const isElectric = computed(() => {
    return input.value.engineType === 'محرك كهربائي';
});

// 4. قواعد التحقق للسعة الفعلية (Requirement 2)
const actualCapacityRules = [
    v => {
        // إذا كان كهربائي، لا نشترط القيمة
        if (isElectric.value) return true;
        // مطلوب
        if (!v) return 'مطلوب';
        // رقم صحيح
        if (!Number.isInteger(Number(v))) return 'رقم صحيح فقط';

        // التحقق من النطاق
        if (input.value.rangeObj) {
            const min = input.value.rangeObj.min;
            const max = input.value.rangeObj.max;
            const val = Number(v);

            if (val < min || val > max) {
                return `القيمة يجب أن تكون بين ${min} و ${max} بناءً على الشريحة المختارة`;
            }
        }
        return true;
    }
];

const onMakeChange = () => {
    input.value.model = null;
};

// Headers
const headers = [
    { title: 'الإجراءات', key: 'actions', sortable: false },
    { title: 'الماركة', key: 'make' },
    { title: 'الطراز', key: 'model' },
    { title: 'سنة الصنع', key: 'year' },
    { title: 'نوع المحرك', key: 'engineType' },
    { title: 'سعة المحرك', key: 'rangeLabel' },
    { title: 'السعة الفعلية', key: 'actualCapacity' },
    { title: 'كاملة (تطبيق)', key: 'fullAg' },
    { title: 'كاملة (لا تطبق)', key: 'fullNoAg' },
    { title: 'متوسطة (تطبيق)', key: 'interAg' },
    { title: 'متوسطة (لا تطبق)', key: 'interNoAg' },
    { title: 'أساسية (تطبيق)', key: 'basicAg' },
    { title: 'أساسية (لا تطبق)', key: 'basicNoAg' },
];

const showMsg = (text, color = 'error') => {
    snackbar.value = { show: true, text, color };
};

const handleCalculationRequest = async () => {
    // تفعيل التحقق من جميع الحقول بما فيها السعة الفعلية
    const { valid } = await form.value.validate();
    if (!valid) return;

    const noAgVal = Number(input.value.depositNoAg);
    const agVal = Number(input.value.depositAg);

    if (noAgVal < agVal) {
        showMsg('خطأ: قيمة الوديعة بدون تطبيق لا يمكن أن تكون أقل من التطبيق.', 'error');
        return;
    }

    const results = calculateFees({
        depositNoAgreement: noAgVal,
        depositAgreement: agVal,
        rangeDiscount: input.value.rangeObj.discount
    });

    const isWarning = (results.fullAg > results.fullNoAg) ||
        (results.interAg > results.interNoAg) ||
        (results.basicAg > results.basicNoAg);

    pendingRecord = {
        make: input.value.make,
        model: input.value.model,
        year: input.value.year,
        engineType: input.value.engineType,
        rangeLabel: input.value.rangeObj.label,
        rangeDiscount: input.value.rangeObj.discount,
        actualCapacity: isElectric.value ? 0 : input.value.actualCapacity,
        ...results
    };

    confirmDialog.value = {
        show: true,
        data: results,
        warning: isWarning
    };
};

const confirmAndAdd = () => {
    if (pendingRecord) {
        store.addRecord(pendingRecord);
        confirmDialog.value.show = false;
        showMsg('تمت الإضافة', 'success');
    }
};

const deleteItem = (id) => {
    if (confirm('حذف هذا السجل؟')) {
        store.removeRecord(id);
    }
};

const resetForm = () => {
    if (form.value) form.value.reset();
    input.value.year = new Date().getFullYear();
};

const formatCurrency = (value) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const exportToExcel = () => {
    // التحقق من وجود بيانات
    if (store.records.length === 0) {
        showMsg('لا توجد بيانات للتصدير', 'warning');
        return;
    }

    // تجهيز البيانات بنفس ترتيب الأعمدة المطلوب
    const exportData = store.records.map(r => {
        // تحديد نص الحالة بناءً على البيانات المخزنة (أو إعادة حسابها بسيطاً)
        // نعتمد هنا على meta.agreementStatusText إذا تم حفظها، أو نحسبها
        const statusText = r.meta?.agreementStatusText ||
            (r.fullAg === r.fullNoAg ? "ليس لها وديعة اتفاقية" : "لها وديعة اتفاقية");

        return {
            "الماركة": r.make,
            "الطراز": r.model,
            "سنة الصنع": r.year,
            "نوع المحرك": r.engineType,
            "سعة المحرك": r.rangeLabel,
            "السعة الفعلية (CC)": r.actualCapacity || "غير محدد",
            "حالة الاتفاقية": statusText, // <--- العمود الجديد
            "الفئة الكاملة (تطبيق)": Math.round(r.fullAg),
            "الفئة الكاملة (لا تطبق)": Math.round(r.fullNoAg),
            "الفئة المتوسطة (تطبيق)": Math.round(r.interAg),
            "الفئة المتوسطة (لا تطبق)": Math.round(r.interNoAg),
            "الفئة الاساسية (تطبيق)": Math.round(r.basicAg),
            "الفئة الاساسية (لا تطبق)": Math.round(r.basicNoAg),
        };
    });

    // إنشاء ورقة العمل
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // تنسيق عرض الأعمدة (اختياري لتحسين الشكل)
    const wscols = [
        { wch: 15 }, // الماركة
        { wch: 15 }, // الطراز
        { wch: 10 }, // السنة
        { wch: 20 }, // نوع المحرك
        { wch: 30 }, // سعة المحرك
        { wch: 15 }, // السعة الفعلية
        { wch: 20 }, // حالة الاتفاقية
        { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 } // الأرقام
    ];
    worksheet['!cols'] = wscols;

    // إنشاء الملف والحفظ
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "رسوم السيارات");

    // اسم الملف يتضمن التاريخ والوقت
    const fileName = `Cars_Fees_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
};
</script>