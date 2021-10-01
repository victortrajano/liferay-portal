<style>
	#tip {
		background-color: #F9F9F9;
		border-radius: 8px;
		padding: 24px;
		width: 368px;
	}

	#tip.hide {
		opacity: 0;
		pointer-events: none;
		transition: opacity .5s linear;
	}
	
	#tip ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	
	#tip li {
		color: #606167;
		display: flex;
		font-size: 16px;
		font-weight: bold;
    	align-items: center;
	}
	
	#tip li::before {
		-webkit-mask-size: cover;
		-webkit-mask: url(${listIcon.getData()}) no-repeat 50% 50%;
		background-color: #999;
		content: "";
		display: inline-block;
		flex-shrink: 0;
		height: 16px;
		margin-right: 4px;
		mask: url(${listIcon.getData()}) no-repeat 50% 50%;
		width: 16px;
	}

	#tip #dismiss {
		background: none;
		border: none;
		color: #7D7E85;
		cursor: pointer;
		padding: 0;
		text-decoration-line: underline;
	}

	#tip .title {
		font-size: 24px;
		word-wrap: break-word;
	}
	
	<#if titleIcon.getData() ?? && titleIcon.getData() != "">
		#tip .title::before {
			-webkit-mask-size: cover;
			-webkit-mask: url(${titleIcon.getData()}) no-repeat 50% 50%;
			background-color: #98999B;
			content: "";
			display: inline-block;
			height: 20px;
			margin-right: 5px;
			mask: url(${titleIcon.getData()}) no-repeat 50% 50%;
			width: 20px;
		}
	</#if>

	<#if externalLinkIcon.getData() ?? && externalLinkIcon.getData() != "">
		#tip .external_link a::after {
			-webkit-mask-size: cover;
			-webkit-mask: url(${externalLinkIcon.getData()}) no-repeat 50% 50%;
			background-color: #4C85FF;
			content: "";
			display: inline-block;
			height: 15px;
			margin-left: 5px;
			mask: url(${externalLinkIcon.getData()}) no-repeat 50% 50%;
			width: 20px;
		}
	</#if>
	
	.back-to-edit-info {
		background-color: transparent;
		border-radius: 4px;
		border: 1px solid #7D7E85;
		box-sizing: border-box;
		color: #7D7E85;
		font-size: 14px;
		font-style: normal;
		font-weight: bold;
		letter-spacing: 0.03em;
		line-height: 24px;
		margin-bottom: 8px;
		padding: 10px;
		text-transform: uppercase;
	}
</style>

<#assign applicationNameSpace = randomNamespace>

<script>
	function ${applicationNameSpace}backToEdit() {
		let siteName = '';
		
		try {
			const {pathname} = new URL(Liferay.ThemeDisplay.getCanonicalURL());
			const urlPaths = pathname.split('/').filter(Boolean);
			siteName = '/' + urlPaths.slice(0, urlPaths.length - 1).join('/');
		} catch (error) {
			console.warn(error);
		}
		
		window.location.href = siteName + '/get-a-quote';
		localStorage.setItem('raylife-back-to-edit', true);
	}
</script>

<div id="tip">
	<#if (title.getData())??>
		<h1 class="title">${title.getData()}</h1>
	</#if>
	
	<#if (subtitle.getData())??>
		<p class="subtitle">
			${subtitle.getData()}
		</p>
	</#if>
	
	<#if (actionList.getData())??>
		${actionList.getData()}
	</#if>

	<#if (description.getData())??>
		<p class="description">
			${description.getData()}
		</p>
	</#if>

	<#if (externalLink.getData())??>
		<div class="external_link">
			${externalLink.getData()}
		</div>
	</#if>
	
	<#if pageOptions.getData()?contains("showBacktoEdit")>
		<button class="back-to-edit-info" onclick="${applicationNameSpace}backToEdit()">
		<#if (backIcon.getData())??>
			<img src="${backIcon.getData()}" /> 
		</#if>
			Back to Edit Info
		</button>
	</#if>
	
	<#if pageOptions.getData()?contains("dismissible")>
		<div class="d-flex justify-content-center">
			<button type="button" id="dismiss" onclick="event.preventDefault(); document.getElementById('tip').classList.add('hide');">Dismiss</button>
		</div>
	</#if>
</div>