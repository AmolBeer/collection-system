import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Radio, Select, message } from 'antd';
import { OverdueStage } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { products } from '../data/defaultStages';

interface Props {
  visible: boolean;
  stage: OverdueStage | null;
  stages: OverdueStage[];
  selectedProductId: string | null;
  onCancel: () => void;
  onSave: (stage: OverdueStage) => void;
}

function StageModal({ visible, stage, stages, selectedProductId, onCancel, onSave }: Props) {
  const [form] = Form.useForm();
  const [maxDaysInfinity, setMaxDaysInfinity] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (visible) {
      if (stage) {
        form.setFieldsValue({
          name: stage.name,
          minDays: stage.minDays,
          maxDays: stage.maxDays,
          enabled: stage.enabled,
          productId: stage.productId,
        });
        setMaxDaysInfinity(stage.maxDays === null);
      } else {
        form.resetFields();
        form.setFieldsValue({
          enabled: true,
          productId: selectedProductId || products[0]?.id,
        });
        setMaxDaysInfinity(false);
      }
    }
    
    return () => {
      form.resetFields();
    };
  }, [visible, stage, form, selectedProductId]);

  const validateRanges = (minDays: number, maxDays: number | null, productId: string, id: string | undefined) => {
    for (const s of stages) {
      if (id && s.id === id) continue;
      if (s.productId !== productId) continue;
      const sMax = s.maxDays === null ? Infinity : s.maxDays;
      const newMax = maxDays === null ? Infinity : maxDays;
      const newMin = minDays;
      const sMin = s.minDays;

      if (newMin <= sMax && newMax >= sMin) {
        return false;
      }
    }
    return true;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { name, minDays, maxDays, enabled, productId } = values;
      const finalMaxDays = maxDaysInfinity ? null : maxDays;

      if (!validateRanges(minDays, finalMaxDays, productId, stage?.id)) {
        message.error(t.overlapError);
        return;
      }

      if (minDays > (finalMaxDays ?? Infinity)) {
        message.error(t.minMaxError);
        return;
      }

      const stageData: OverdueStage = {
        id: stage?.id || '',
        name,
        minDays,
        maxDays: finalMaxDays,
        enabled,
        productId,
      };

      onSave(stageData);
    } catch {
      return;
    }
  };

  return (
    <Modal
      title={stage ? t.editStage : t.addNewStage}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t.save}
      cancelText={t.cancel}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="productId"
          label={t.product}
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <Select disabled={!!stage} options={products.map(p => ({ value: p.id, label: p.name }))} />
        </Form.Item>

        <Form.Item
          name="name"
          label={t.stageNameLabel}
          rules={[{ required: true, message: '请输入阶段名称' }]}
        >
          <Input placeholder="如 M0、M1、M2 等" />
        </Form.Item>

        <Form.Item
          name="minDays"
          label={t.startDays}
          rules={[{ required: true, message: '请输入最小天数' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label={t.endDays}>
          <Radio.Group
            value={maxDaysInfinity}
            onChange={(e) => setMaxDaysInfinity(e.target.value)}
            style={{ marginBottom: 8 }}
          >
            <Radio value={false}>{t.finite}</Radio>
            <Radio value={true}>{t.infinite}</Radio>
          </Radio.Group>
          {!maxDaysInfinity && (
            <Form.Item
              name="maxDays"
              rules={[{ required: !maxDaysInfinity, message: '请输入最大天数' }]}
              noStyle
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}
        </Form.Item>

        <Form.Item
          name="enabled"
          label={t.status}
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={true}>{t.enabled}</Radio>
            <Radio value={false}>{t.disabled}</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default StageModal;