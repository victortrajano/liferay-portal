/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";

import { Radio } from "../../../../fragments/Forms/Radio";
import { LiferayService } from "../../../../../services/liferay";
import { MoreInfoButton } from "../../../../fragments/Buttons/MoreInfo";
import { BUSINESS_TYPE_INFO_EVENT } from "../../../../../events";

export const BusinessTypeRadioGroup = ({ businessTypes = [] }) => {
  const { control, setValue } = useFormContext();
  const form = useWatch();

  useEffect(() => {
    if (form?.basics?.businessCategoryId) setCategoryProperties();
  }, [form?.basics?.businessCategoryId]);

  const setCategoryProperties = async () => {
    try {
      const categoryId = form.basics.businessCategoryId;

      const categoryProperties = await LiferayService.getCategoryProperties(
        categoryId
      );

      setValue("basics.properties.businessClassCode", categoryProperties.find(({ key }) => key === "BCC").value);
      setValue("basics.properties.segment", categoryProperties.find(({ key }) => key === "Segment").value);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <fieldset id="businessType" className="content-column">
      <Controller
        name="basics.businessCategoryId"
        defaultValue=""
        control={control}
        rules={{ required: "Please, Select a field." }}
        render={({ field }) =>
          businessTypes.map((businessType) => (
            <Radio
              {...field}
              key={businessType.id}
              value={businessType.id}
              label={businessType.title}
              description={businessType.description}
              selected={businessType.id === form?.basics?.businessCategoryId}
              renderActions={
                <MoreInfoButton
                  event={BUSINESS_TYPE_INFO_EVENT}
                  value={businessType.id}
                />
              }
            />
          ))
        }
      />
      <button
        type="button"
        className="btn badge"
        style={{ width: "fit-content" }}
      >
        None of these describe my business
      </button>
    </fieldset>
  );
};
