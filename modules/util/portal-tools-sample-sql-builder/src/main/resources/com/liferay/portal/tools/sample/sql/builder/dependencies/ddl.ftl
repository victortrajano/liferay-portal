<#assign ddlRecordSetCounts = dataFactory.getSequence(dataFactory.maxDDLRecordSetCount) />

<#list ddlRecordSetCounts as ddlRecordSetCount>
	<#if ddlRecordSetCount = 1>
		<#assign
			ddmStructureModel = dataFactory.newDDLDDMStructureModel(groupId)
			ddmStructureVersionModel = dataFactory.newDDMStructureVersionModel(ddmStructureModel)
		/>

		<@insertDDMStructure
			_ddmStructureLayoutModel=dataFactory.newDDLDDMStructureLayoutModel(groupId, ddmStructureVersionModel)
			_ddmStructureModel=ddmStructureModel
			_ddmStructureVersionModel=ddmStructureVersionModel
		/>
	</#if>

	<#assign
		layoutName = "dynamic_data_list_display_" + ddlRecordSetCount
		portletId = "com_liferay_dynamic_data_lists_web_portlet_DDLDisplayPortlet_INSTANCE_TEST" + ddlRecordSetCount

		layoutModel = dataFactory.newLayoutModel(groupId, layoutName, "", portletId)
	/>

	<@insertLayout _layoutModel=layoutModel />

	<#assign ddlRecordSetModel = dataFactory.newDDLRecordSetModel(ddmStructureModel, ddlRecordSetCount) />

	${dataFactory.toInsertSQL(ddlRecordSetModel)}

	${dataFactory.toInsertSQL(dataFactory.newDDMStructureLinkModel(ddlRecordSetModel))}

	<#assign ddlRecordCounts = dataFactory.getSequence(dataFactory.maxDDLRecordCount) />

	<#list ddlRecordCounts as ddlRecordCount>
		<#assign ddlRecordModel = dataFactory.newDDLRecordModel(ddlRecordSetModel) />

		${dataFactory.toInsertSQL(ddlRecordModel)}

		${dataFactory.toInsertSQL(dataFactory.newDDLRecordVersionModel(ddlRecordModel))}

		<@insertDDMContent
			_currentIndex=ddlRecordCount
			_ddmStorageLinkId=dataFactory.getCounterNext()
			_ddmStructureId=ddmStructureModel.structureId
			_ddmStructureVersionId=ddmStructureVersionModel.structureVersionId
			_entry=ddlRecordModel
		/>

		${csvFileWriter.write("dynamicDataList", virtualHostModel.hostname + "," + ddlRecordModel.groupId + "," + layoutName + "," + portletId + "," + ddlRecordSetModel.recordSetId + "," + ddlRecordModel.recordId + "\n")}
	</#list>

	<#assign ddlPortletPreferencesModel = dataFactory.newPortletPreferencesModel(layoutModel.plid, portletId) />

	${dataFactory.toInsertSQL(ddlPortletPreferencesModel)}

	<#assign ddlPortletPreferenceValueModels = dataFactory.newDDLPortletPreferenceValueModels(ddlPortletPreferencesModel, ddlRecordSetModel) />

	<#list ddlPortletPreferenceValueModels as ddlPortletPreferenceValueModel>
		${dataFactory.toInsertSQL(ddlPortletPreferenceValueModel)}
	</#list>

	<#assign portletPreferencesModels = dataFactory.newDDLPortletPreferencesModels(layoutModel.plid) />

	<#list portletPreferencesModels as portletPreferencesModel>
		${dataFactory.toInsertSQL(portletPreferencesModel)}
	</#list>
</#list>