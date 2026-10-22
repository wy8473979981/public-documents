<template>
  <div class="login-page">
    <nav-bar :navOption="navOption"></nav-bar>
    <!-- 背景图 -->
    <bg-image src="/static/icons/bg.jpeg"></bg-image>
    <div class="login-content">
      <img src="../../static/icons/2132975495.png" alt="" class="login-logo" />
      <div class="login-title">欢迎使用AI对练工具</div>
      <div class="login-input-box">
        <input type="text" class="login-input" :class="{ 'login-input-readonly': isStep2 }"
          placeholder-class="login-input-placeholder" v-model="regData.userName" placeholder="请输入用户名"
          :disabled="isStep2" @blur="onUserNameBlurOrChange" @change="onUserNameBlurOrChange" />
      </div>
      <div class="login-input-box" v-if="isStep2">
        <input type="text" :password="!showPassword" class="login-input" placeholder-class="login-input-placeholder"
          v-model="regData.password" placeholder="请输入用户密码" @blur="onPasswordBlurOrChange"
          @change="onPasswordBlurOrChange" />
        <div class="login-input-icon-box" @click="changeShowPassword" v-if="regData.password">
          <image src="../../static/icons/password.png" v-show="showPassword" mode="" class="login-input-icon" />
          <image src="../../static/icons/password-no.png" v-show="!showPassword" mode="" class="login-input-icon" />
        </div>
      </div>
      <div class="login-page-err" v-if="errMsg">{{ errMsg }}</div>
    </div>

    <div class="login-butt-box" v-if="!isStep2">
      <div class="login-butt" :class="[canClickLogin ? 'login-butt-active' : '']" @click="clickNextStep">
        下一步
      </div>
    </div>
    <template v-else>
      <image src="../../static/login/tips.png" v-if="showTips" mode="" class="login-tips-top" />
      <div class="login-tips">
        <image src="../../static/login/uncheck.png" v-if="!checked" mode="" style="width: 24.02rpx;height: 24.02rpx;"
          @click="checked = !checked" />
        <image src="../../static/login/checked.png" v-else mode="" style="width: 24.02rpx;height: 24.02rpx;"
          @click="checked = !checked" />
        <div class="login-tips-text">已阅读并同意 <span class="login-tips-text-blue" @click="handleShowDialog(true)">《隐私政策》</span><span class="login-tips-text-blue" @click="handleShowDigestDialog(true)">《隐私声明摘要》</span></div>
      </div>
      <span class="login-step-back" @click="clickPrevStep">上一步</span>
      <div class="login-butt-box">
        <div class="login-butt" :class="[canClickLogin ? 'login-butt-active' : '']" @click="loginForUser">
          登录
        </div>
      </div>
    </template>
    <div class="login-dialog" v-if="showDialog">
      <div class="login-dialog-mask"></div>
      <div class="login-dialog-content">
        <image @click="handleShowDialog(false)" src="../../static/login/close.png" mode="" class="login-dialog-close" />
        <div class="login-dialog-body">
          <div class="login-dialog-title">隐私声明</div>
          <div class="login-dialog-scroll">
            <div>
              <div style="font-weight: bold;">最近更新日期：</div>2025年09月17日
            </div>
            <div>
              <div style="font-weight: bold;">生效日期：</div>2025年09月17日
            </div>
            <div>
              <div style="font-weight: bold;">版本号：</div>AIA-eCINDI 2025.0917.1.prd
            </div>
            <div>
              感谢您对友邦人寿保险有限公司（注册地址：上海市黄浦区中山东一路17号3至8楼，以下又称“友邦”或“我们”）的信任。作为eCINDI的运营者，我们深知遵循合法、正当、必要和诚信原则处理您个人信息的重要性，本平台遵照中华人民共和国相关法律保护个人隐私。
            </div>
            <div>
              本《隐私声明》（以下简称“本声明”）旨在向您介绍eCINDI处理您的个人信息的目的、方式和范围，以及您如何行使您享有的基于个人信息保护的权利，具体而言本声明包括：
            </div>
            <div>引言</div>
            <div>一、定义</div>
            <div>二、我们如何收集、使用您的个人信息</div>
            <div>三、我们如何委托处理、向第三方提供、转移以及公开披露您的个人信息</div>
            <div>四、我们如何存储和保护您的个人信息</div>
            <div>五、我们如何保护未成年人的个人信息</div>
            <div>六、如何管理您的个人信息</div>
            <div>七、我们如何使用COOKIE及相关技术</div>
            <div>八、本隐私声明如何更新</div>
            <div>九、如何与我们联系</div>
            <div>
              请您在开始使用eCINDI前，仔细阅读并确保您已经完全理解本声明，特别是以粗体标识的条款，并决定是否同意我们据此处理您的个人信息。您同意本声明仅代表您已了解eCINDI提供的功能，以及功能运行所需的个人信息，对于本声明未提及的其他个人信息，我们将根据您使用过程中的授权情况单独征求您的同意。您可选择不向我们提供相应功能所要求的个人信息，但可能会限制我们向您提供产品和服务或响应您请求的能力。请您注意，在法律允许的情况下，我们可以不基于您的同意而处理您的个人信息。此外，匿名化处理后的信息不再属于个人信息，因此不受本声明的约束和保护。
            </div>
            <div>
              请您注意，本声明仅适用于我们的eCINDI服务，对于我们提供的保险产品或健康管理服务等，我们将在您使用该类业务产品或服务前，通过营销员告知或APP页面等方式向您展示单独的隐私声明，对于eCINDI中由第三方提供的产品和服务，请您阅读相应第三方的服务协议或者隐私政策，我们不对第三方的个人信息处理活动承担任何法律责任。
            </div>
            <div style="font-weight:bold;">一、定义</div>
            <div>本声明中的以下名词的具体含义为：</div>
            <div>
              <span style="font-weight:bold;">个人信息：</span>以电子或者其他方式记录的与已识别或者可识别的自然人有关的各种信息，不包括匿名化处理后的信息。
            </div>
            <div>
              <span
                style="font-weight:bold;">敏感个人信息：</span>一旦泄露或者非法使用，容易导致自然人的人格尊严受到侵害或者人身、财产安全受到危害的个人信息，包括生物识别、宗教信仰、特定身份、医疗健康、金融账户、行踪轨迹等信息，以及不满十四周岁未成年人的个人信息。
            </div>
            <div>
              <span style="font-weight:bold;">处理：</span>包括个人信息的收集、存储、使用、加工、传输、提供、公开、删除等。
            </div>
            <div>
              <span style="font-weight:bold;">匿名化：</span>是指个人信息经过处理无法识别特定自然人且不能复原的过程。
            </div>
            <div>本声明中出现以上未定义的相关名词含义，除由特殊说明外，与中华人民共和国个人信息保护相关法律法规的含义保持一致。</div>
            <div style="font-weight:bold;">二、我们如何收集、使用您的个人信息</div>
            <div>
              在您使用eCINDI所提供的功能或者服务过程中，我们仅会通过本声明所述目的，收集和使用您在使用eCINDI过程中主动提供以及因使用eCINDI而产生的个人信息。如果我们需要收集本声明之外的您的其他个人信息，我们将以合理的方式向您告知并在收集前征得您的同意。
            </div>
            <div style="font-weight:bold;">（一）您在访问本eCINDI期间使用的服务及其所需处理的个人信息</div>
            <div>
              基本功能
              <br>
              以下服务为eCINDI的基本功能，如您不同意我们按照如下规则处理您的个人信息，我们将无法为您提供对应的服务。
            </div>
            <div style="font-weight:bold;">（二）第三方SDK清单</div>
            <div>
              场景1：当您使用eCINDI时，我们会使用以下具有相应业务资质及服务能力的第三方服务商提供的软件开发工具包（简称“SDK”）来为您提供服务。
              <br>
              场景2：当您使用本eCINDI时，我们不会使用任何第三方服务商提供的软件开发工具包（简称“SDK”）来为您提供服务。
            </div>
            <div style="font-weight:bold;">（三）无需征得同意的情形</div>
            <div>为订立、履行您作为一方当事人的合同所必需；</div>
            <div>为履行法定义务所必需；</div>
            <div>为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；</div>
            <div>为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理个人信息；</div>
            <div>在合理的范围内处理个人自行公开或者其他已经合法公开的个人信息；</div>
            <div>法律、行政法规规定的其他情形。</div>
            <div style="font-weight:bold;">三、我们如何委托处理、向第三方提供、转移以及公开披露您的个人信息</div>
            <div style="font-weight:bold;">（一）委托处理</div>
            <div>
              为实现本声明上述功能所述目的，我们可能会委托一个或多个合作伙伴代表我们向您提供某项服务或履行某项职能，若涉及个人信息委托处理的，我们会与受托合作伙伴通过协议约定个人信息委托处理的范围，并要求受托合作伙伴严格按照约定处理个人信息，不得超出约定的处理目的、处理方式，以及遵循《个人信息保护法》等相关法律法规的规定采取审慎有效的个人信息保护措施以保障您的个人信息安全。
              我们委托的合作伙伴包括以下类型：。
            </div>
            <div style="font-weight:bold;">（二）向第三方提供</div>
            <div>
              一般而言，我们不会向第三方提供您的个人信息，但为实现本声明上述功能所述目的，可能会由第三方直接向您提某项服务，以顺利实现您享有的服务。我们会与这类第三方通过协议约定等方式要求其遵守严格的保密义务并采取安全有效的保护措施以保障个人信息安全，若第三方因自身业务开展等需变更原先的处理目的、处理方式，或相关法律法规明确规定向第三方提供适用单独同意的情形，这类第三方应依法重新获得您的同意或单独同意。
              您可查看清单以了解我们向第三方提供个人信息的情形。
            </div>
            <div style="font-weight:bold;">（三）转移</div>
            <div>
              若我们因合并、分立、解散、被宣告破产等原因需要转移您的个人信息，我们将会向您告知接收方的名称（或者姓名）和联系方式，并要求接收方继续履行本声明所述义务以及遵循《个人信息保护法》等相关法律法规规定的义务。若接收方变更本政策的处理目的、处理方式的，接收方将向您重新取得个人同意。
            </div>
            <div style="font-weight:bold;">（四）公开披露</div>
            <div>
              我们将遵守相关法律法规，对您的个人信息予以保密。除非事先获得您的单独同意或依照法律规定所必需，我们不会公开披露您的个人信息，但以下情形除外：
              <br>
              在获得您单独同意后；
              <br>
              在法律、法律程序、诉讼或政府主管部门强制性要求时；
              <br>
              为了维护自身合法权益而向您提起诉讼或者仲裁时。
            </div>
            <div style="font-weight:bold;">（五）无需征得同意的情形</div>
            <div>为订立、履行您作为一方当事人的合同所必需；</div>
            <div>为履行法定义务所必需；</div>
            <div>为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；</div>
            <div>为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理个人信息；</div>
            <div>在合理的范围内处理个人自行公开或者其他已经合法公开的个人信息；</div>
            <div>法律、行政法规规定的其他情形。</div>
            <div style="font-weight:bold;">四、我们如何存储和保护您的个人信息</div>
            <div style="font-weight:bold;">（一）您的个人信息是如何在全球范围内提供的</div>
            <div>
              原则上，我们在中华人民共和国（简称“中国”）境内收集和产生的个人信息存储在中国境内；但由于我们可能会使用遍布全球的资源和服务器向您提供保险业务以及其所需服务，若我们向您提供保险业务以及其所需服务涉及个人信息的出境的，我们将获取您的单独同意、要求境外接收方采取审慎必要措施以保障出境个人信息可以得到《个人信息保护法》同等水平的保护，以及严格遵循有关个人信息出境的法律法规并落实其规定的要求和条件。
              我们将根据法律法规要求进行个人信息保护影响评估，并且完成通过国家网信部门组织的跨境传输安全评估、进行个人信息保护认证，或按照国家网信部门制定的标准合同与境外接收方订立合同，约定我们与境外接收方的权利和义务。涉及向境外司法或执法机构提供您的个人信息前，我们会根据法律法规的要求，获得中华人民共和国主管机关的同意。
            </div>
            <div style="font-weight:bold;">（二）我们如何存储您的个人信息</div>
            <div>
              我们将依据相关法律法规规定的保存期限保存您的个人信息，包括《网络安全法》等。
              若上述法律法规对同一种类的个人信息规定了不同的保存期限，我们将按最长保存期限保存，法律法规另有规定的除外；若相关法律法规有修订、废止或更新的，我们将及时调整并向您告知。
              若无相关法律法规的明确规定，我们将在实现处理目的所必需的期限内保存您的个人信息。我们判断个人信息的存储期限将根据风险控制、安全保障、业务管理、国家及行业标准等因素合理评估和确定。
              超出保存期限后，我们会依法依约删除或匿名化处理您的个人信息。如果删除从技术上难以实现的，我们会停止除存储和采取必要的安全保护措施之外的处理活动。
              如我们终止运营eCINDI，我们将提前30天通知您，停止相关的个人信息收集活动，并在合理的期限内删除或匿名化处理您的个人信息。
            </div>
            <div style="font-weight:bold;">（三）我们如何保护您的个人信息</div>
            <div>
              我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、泄露、篡改或丢失。我们会采取合理可行的措施，保护您的个人信息。例如，在传输数据时采用SSL加密；我们同时对本网页提供https安全浏览方式；我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访问个人信息；以及我们会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。
              但同时请您注意，互联网并非绝对安全的环境，而且电子邮件、即时通讯等与其他用户的交流方式并未加密，我们强烈建议您不要通过此类方式发送个人信息。请使用复杂密码，协助我们保证您的信息安全。
              如发生个人信息安全事件，我们将按照法律法规的要求，及时采取补救措施进行处置，并将事件相关情况以邮件、信函、电话、推送通知等方式中的一种或多种告知您。同时，我们还将依据相关法律法规的要求规定，向主管部门报告个人信息安全事件处置情况。
            </div>
            <div style="font-weight:bold;">五、我们如何保护未成年人的个人信息</div>
            <div>
              我们的eCINDI服务主要面向成人。根据相关法律法规的规定，若您是18周岁以下的未成年人，在使用eCINDI服务前，应事先取得您父母或法定监护人的同意。特别地，若您是14周岁以下的儿童，儿童及其监护人在为儿童使用我们的产品或服务前，还应仔细阅读我们专门制定的《儿童个人信息保护政策》，只有在取得监护人对《儿童个人信息保护政策》的同意后，您才可在监护人的指导下使用我们的产品和服务。如果我们发现自己在未事先获得监护人同意的情况下收集了儿童个人信息，我们会设法尽快删除相关数据。
              若您是儿童的父母或其他监护人，请您关注儿童是否是在取得您的授权同意之后使用我们的产品或服务。如您对儿童个人信息有疑问，请通过“九、如何与我们联系”中的联系方式与我们联系。
            </div>
            <div style="font-weight:bold;">六、如何管理您的个人信息</div>
            <div>
              我们充分尊重您对个人信息的权利，并保障您可以通过以下方式管理您的个人信息：
            </div>
            <div style="font-weight:bold;">（一）查阅、更正或补充</div>
            <div>
              您可以通过以下方式自行查阅、更正或补充您的个人信息：
              如果您希望查阅、更正或补充您在本eCINDI中提供的个人身份信息或您希望查阅、更正或补充您在使用我们的产品或服务过程中产生的其他个人信息的，您可以通过“如何与我们联系”所列方式与我们取得联系以行使您的相关权利。
            </div>
            <div style="font-weight:bold;">（二）复制、转移</div>
            <div>
              您有权复制我们所保存的您的个人信息，或在符合法律法规的条件下，您要求我们将您的个人信息转移至您指定的个人信息处理者。您可以通过“如何与我们联系”所列方式与我们取得联系。
            </div>
            <div style="font-weight:bold;">（三）改变授权范围</div>
            <div>
              您有权改变或者撤回您授权我们收集、处理您的个人信息的范围。您可以通过“如何与我们联系”所列方式与我们取得联系。
              当您撤回同意后，我们无法继续为您提供撤回同意所对应的服务，也不再处理相应的个人信息。但您撤回同意的决定，不会影响此前基于您的同意而开展的个人信息处理活动的效力。
            </div>
            <div style="font-weight:bold;">（四）删除</div>
            <div>
              在满足以下条件时，您可以通过“如何与我们联系”所列方式与我们取得联系请求删除您的个人信息：
              <br>
              处理目的已实现、无法实现或者为实现处理目的不再必要；
              <br>
              我们停止提供产品或者服务，或者保存期限已届满；
              <br>
              您撤回同意；
              <br>
              我们违反法律、行政法规或者违反约定处理个人信息；
              <br>
              法律、行政法规规定的其他情形。
              <br>
              请您注意，删除权的行使并非绝对的，仅在上述法定情形下，您有权请求我们删除您的个人信息。此外，出于法定保存期限要求或技术上的限制，我们可能难以删除您的个人信息，但我们会停止除存储和采取必要的安全保护措施之外的处理活动。
            </div>
            <div style="font-weight:bold;">（五）已故用户的个人信息保护</div>
            <div>
              如果我们的客户不幸逝世，您作为近亲属，为了自身的合法、正当利益，您可以依法对逝者的相关个人信息行使查阅、复制、更正、删除等权利，除非逝者生前另有安排。请通过“如何与我们联系”所列方式与我们取得联系，但为了保护逝者个人信息安全，我们需要您协助提交相应的证明文件。
            </div>
            <div style="font-weight:bold;">（六）我们如何响应您的请求</div>
            <div>
              一般情况下，我们将在十五日内予以回复。对于您的合理请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，根据相关法律法规的规定，友邦有权对上述个人数据请求的处理收取直接相关和必要的费用。对于那些无端重复、需要过多技术手段、给他人合法权益带来风险或者非常不切实际的请求，我们可能会予以拒绝。除了通过上述方式联系友邦外，您也有权向个人信息保护主管机关反映您的问题或投诉。
              在以下情形中，按照法律法规要求，我们将无法响应您的请求：
              <br>
              与我们履行法律法规规定的义务相关的；
              <br>
              与国家安全、国防安全直接相关的；
              <br>
              与公共安全、公共卫生、重大公共利益直接相关的；
              <br>
              与犯罪侦查、起诉、审判和判决执行等直接相关的；
              <br>
              有充分证据表明您存在主观恶意或滥用权利的；
              <br>
              响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
              <br>
              涉及商业秘密的。
            </div>
            <div style="font-weight:bold;">七、我们如何使用COOKIE和相关技术</div>
            <div>
              Cookie是包含少量信息的小型文本文件，并且被下载并保存在您的任何网页浏览器或上网设备中。
              官网使用了Cookie及其他工具，以便将您与本网站其他用户区分开来。这些工具能够帮助我们在您使用本网站时，向您提供良好体验，也让我们能够改进本网站的功能。您可以点击此处以查看我们的Cookie政策，以了解我们使用的Cookie类型以及如何管理Cookie。
            </div>
            <div style="font-weight:bold;">八、本隐私声明如何更新</div>
            <div>
              友邦保留在任何时候未经声明地增加、变更、更新或修改本隐私声明内容的权利，只是将该变更、更新或修改通知您。根据法律法规及服务运营需要，如果我们决定要变更本声明时，我们会在官网中提示您进行浏览和确认，以便让您在第一时间了解我们要收集哪些信息、我们会如何使用所收集的信息、以及我们会在什么情况下披露所收集的信息。
              在您收到上述更新后，请您仔细阅读详细内容，如您不同意更新后的内容，应立即停止使用相应功能，我们将停止收集您的相关个人信息；如您继续使用相应功能，即视为同意接受更新内容。您可点击此处查看本声明的旧版本。
              对于重要变更、以及需要寻求您对相关变更的同意时，我们还会提供更为显著的通知（我们会通过包括但不限于短信、或在浏览页面做特别提示、弹窗提示及邮件等方式，说明隐私声明的具体变更内容）。
              本政策所指的重大变更包括但不限于：
              <br>
              我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
              <br>
              我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
              <br>
              个人信息向第三方提供、转让或公开披露的主要对象发生变化；
              <br>
              您参与个人信息处理方面的权利及其行使方式发生重大变化；
              <br>
              我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
              <br>
              个人信息保护影响评估报告表明存在高风险时。
            </div>
            <div style="font-weight:bold;">九、如何与我们联系</div>
            <div>
              如果您对本隐私声明或相关事宜有任何疑问、意见或建议，或您对于我们的个人信息处理活动有任何权利请求的，您可以通过以下方式与我们取得联系：
              <br>
              部门：Technology Innovation
              <br>
              邮箱：AIA_China_Compliance@aia.com
              <br>
              一般情况下，我们将在十五日内予以回复。
            </div>
          </div>
        </div>
		

      </div>
    </div>

    <div class="login-dialog" v-if="showDigestDialog">
      <div class="login-dialog-mask"></div>
      <div class="login-dialog-content">
        <image @click="handleShowDigestDialog(false)" src="../../static/login/close.png" mode="" class="login-dialog-close" />
        <div class="login-dialog-body">
          <div class="login-dialog-title">隐私声明摘要</div>
          <div class="login-dialog-scroll">
            <div>
              <div style="font-weight: bold;">更新日期：</div>2026年03月23日
            </div>
            <div>
              <div style="font-weight: bold;">生效日期：</div>2026年03月23日
            </div>
            <br>
            <div>
              友邦人寿高度重视您的个人信息安全，我们严格遵循合法、正当、必要和诚信原则处理您的个人信息，遵守法律法规保护个人隐私。以下摘要能帮助你更直观、简洁地概览隐私声明的内容。
            </div>
            <br>
            <div>
              1.我们如何收集、使用您的个人信息
            </div>
            <div>
              <div><span style="font-weight:bold;">业务场景：</span><span>智能陪练</span></div>
              <div><span style="font-weight:bold;">收集方式：</span><span>微信小程序</span></div>
              <div><span style="font-weight:bold;">信息类型：</span><span>个人手机号等信息</span></div>
            </div>
            <br>
            <div>
              2.我们如何委托处理、向第三方提供、转移以及公开披露您的个人信息
            </div>
            <div>我们会秉持合法、正当、必要的原则，并严格遵守相关法律法规。在委托处理时，我们会与受托方签订严格的保密协议，明确双方的权利与义务，确保您的信息安全。向第三方提供或转移个人信息时，我们会提前告知您信息的类型、目的和相关方，并获得您的授权同意。对于公开披露，我们仅在取得您的明确同意或法律法规要求的情况下进行，并确保信息披露过程符合法律规定。</div>
            <br>
            <div>
              3.我们如何存储和保护您的个人信息
            </div>
            <div>
              我们会采取合理可行的安全措施存储和保护您的个人信息，防止其遭受未经授权的访问、披露、使用、修改、损坏或丢失。只有授权员工和合作方才能访问您的个人信息，并且我们会定期进行安全风险评估。此外，我们会在法律规定的期限内存储您的信息，并在超期后及时删除或匿名化处理。
            </div>
            <br>
            <div>4.如何管理您的个人信息</div>
            <div>
              您可以通过指定部门或邮箱提交查阅、更正、删除、补充等请求，并进行相关咨询。我们在收到您的请求后，通常会在十五日内给予答复。如果对答复不满意，认为信息处理侵犯了您的合法权益，您还可向相关监管部门投诉或向法院提起诉讼。此外，个人信息保护影响评估如发现高风险，或责任部门、联络方式等发生变化时，也会及时告知并采取相应措施。
            </div>
            <br>
            <div>完整版本请查看《隐私声明》。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import pageCommon from '@/mixins/page.common.js'
export default {
  mixins: [pageCommon],
  data() {
    return {
      navOption: {
        navTitle: 'AI对练工具',
        backgroundColor: '',
        hasPlaceholder: true,
        showBackTip: false,
        color: '#fff'
      },
      regData: {
        userName: '',
        password: ''
      },
      isStep2: false,
      showPassword: false, // 是否显示密码
      errMsg: '', //请输入正确的登录用户名和用户密码
      showDialog: false,
      checked: false,
      showTips: false,
      showDigestDialog: false
    }
  },
  computed: {
    canClickLogin() {
      if (this.regData.userName) {
        return true
      }
      return false
    }
  },
  async onShow() {
    await this.checkUserLogin()
    await this.autoSetLastLoginName()
  },
  methods: {
    handleShowDialog(type) {
      this.showDialog = type
    },
    handleShowDigestDialog(type) {
      this.showDigestDialog = type
    },
    // 自动填充上次登录的用户名
    async autoSetLastLoginName() {
      // 1. 等待用户完成登录(wx.login)
      await this.waitingUserLoaded()
      // 2. 获取最近的登录用户名
      const res = await this.$api.getLastLoginName()
      if (res && res.lastLoginName) {
        this.regData.userName = res.lastLoginName
      }
    },
    onUserNameBlurOrChange(e) {
      // 小程序的ios真机上v-model双向绑定无效
      // https://ask.dcloud.net.cn/question/148407
      if (e && e.detail && e.detail.hasOwnProperty('value')) {
        setTimeout(() => {
          this.regData.userName = e.detail.value
          console.log('userName', this.regData.userName)
        }, 10)
      }
    },
    onPasswordBlurOrChange(e) {
      // 小程序的ios真机上v-model双向绑定无效
      // https://ask.dcloud.net.cn/question/148407
      if (e && e.detail && e.detail.hasOwnProperty('value')) {
        setTimeout(() => {
          this.regData.password = e.detail.value
          // console.log('password', this.regData.password)
        }, 10)
      }
    },
    async clickNextStep() {
      const res = await this.$api.getLoginHint(this.regData.userName)
      if (res) {
        // 如果不是SSO用户，则需要输入密码
        const shouldJumpToStep2 = !res.isSsoUser
        if (shouldJumpToStep2) {
          // 设置用户名：可能第一步的用户名是AiaAgentCode,则第二步需要设置为UserName
          this.regData.userName = res.userName || this.regData.userName
          this.isStep2 = true
          return
        }

        // 否则，默认跳转到sso页面
        let url = '/pages/login/sso'
        const aiaAgentCode = res.aiaAgentCode || ''
        const userName = this.regData.userName || ''
        url += `?aiaAgentCode=${aiaAgentCode}&userName=${userName}`
        uni.navigateTo({ url })
        return
      }
    },
    async clickPrevStep() {
      this.regData.password = '' // 清空密码，防止记住密码
      this.isStep2 = false
    },
    checkPasswordStrength(password) {
      // 密码强度规则：必须包含数字、大小写字母以及特殊字符
      // const passwordRegex =
      //   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-]).{8,}$/

      // 规则1: 密码长度必须大于8位
      if (password.length < 8) {
        return '密码长度必须大于或等于8位'
      }
      // 规则2: 密码必须包含数字
      if (!/\d/.test(password)) {
        return '密码必须包含数字'
      }
      // 规则3: 密码必须包含大写字母
      if (!/[A-Z]/.test(password)) {
        return '密码必须包含大写字母'
      }
      // 规则4: 密码必须包含小写字母
      if (!/[a-z]/.test(password)) {
        return '密码必须包含小写字母'
      }
      // 规则5: 密码必须包含特殊字符
      if (!/[!@#$%^&*_=+-]/.test(password)) {
        return '密码必须包含特殊字符'
      }
      return ''
    },
    async loginForUser() {
      // 确保已调用wx.login，token中获得wechatID
      await this.checkUserLogin()
      if (!this.checked) {
        this.showTips = true
        setTimeout(() => {
          this.showTips = false
        }, 2000)
        return
      }
      if (!this.canClickLogin) return

      // 确保用户输入了用户名和密码
      if (!this.regData.userName) {
        return uni.showModal({
          title: '提示',
          content: '请输入用户名',
          showCancel: false
        })
      }
      if (!this.regData.password) {
        return uni.showModal({
          title: '提示',
          content: '请输入密码',
          showCancel: false
        })
      }

      let loginData = {
        ...this.regData
      }
      const accountInfo = wx.getAccountInfoSync()
      const appID = accountInfo.miniProgram.appId
      const envVersion = accountInfo.miniProgram.envVersion

      const plainPass = loginData.password
      loginData.password = CryptoJS.MD5(plainPass).toString()
      loginData.passwordHash256 = CryptoJS.SHA256(plainPass).toString()

      const res = await this.$api.newLogin(loginData, appID, envVersion)
      if (res && res.error) {
        this.errMsg = res.error
        return
      }

      const userInfo = await this.getUserData()
      // 密码登录成功后，需要设置是否需要sso校验
      if (userInfo && userInfo.id) {
        await this.$store.dispatch(
          'root/setPendingSsoStep',
          userInfo.requireSSO
        )
      }

      // 判断是否需SSO校验
      const shouldJumpToSSO = userInfo && userInfo.requireSSO
      if (shouldJumpToSSO) {
        uni.redirectTo({
          url: '/pages/login/sso'
        })
        return
      }

      // 判断是否需要修改密码
      if (res.isFirstLogin) {
        uni.redirectTo({
          url: '/pages/login/edit'
        })
        return
      }

      // 校验密码强度
      let passwordErrorMsg = this.checkPasswordStrength(this.regData.password)
      console.log(passwordErrorMsg)
      if (passwordErrorMsg) {
        uni.redirectTo({
          url: '/pages/login/edit'
        })
        return
      }

      await this.goHomeOrExamine()
    },

    changeShowPassword() {
      this.showPassword = !this.showPassword
    }
  },
  async onPullDownRefresh() {
    await this.checkUserLogin()
    uni.stopPullDownRefresh()
  }
}
</script>
<style>
.login-input-placeholder {
  color: rgba(0, 0, 0, 0.3);
}
</style>
<style scoped>
.login-page {
  width: 100%;
}

.login-content {
  margin-top: 192rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 208rpx;
}

.login-logo {
  width: 354rpx;
  height: 72rpx;
  margin-bottom: 64rpx;
}

.login-title {
  color: #ffffff;
  font-size: 42rpx;
  margin-bottom: 112rpx;
}

.login-input-readonly {
  background-color: #f5f5f5 !important;
  color: #757575 !important;
}

.login-input-box {
  width: 526rpx;
  height: 80rpx;
  margin-bottom: 40rpx;
  position: relative;
}

.login-input {
  height: 100%;
  border-radius: 40rpx;
  width: 100%;
  background-color: #fff;
  padding-left: 40rpx;
  padding-right: 100rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #000000;
}

.login-input-icon-box {
  width: 100rpx;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-input-icon {
  width: 28rpx;
  height: 28rpx;
}

.login-page-err {
  padding: 0 40rpx;
  box-sizing: border-box;
  color: #f31c38;
  font-size: 22rpx;
  line-height: 34rpx;
  margin-top: 40rpx;
}

.login-step-back {
  color: #ffffff;
  font-size: 32rpx;
  position: fixed;
  bottom: 256rpx;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 1;
  background: transparent;
  height: 112rpx;
  border-radius: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  box-sizing: border-box;
  width: calc(100% - 96rpx);
  margin: 0 48rpx;
  border: 2rpx solid #ffffff;
}

/* 按钮 */
.login-butt-box {
  position: fixed;
  bottom: 96rpx;
  padding: 0 48rpx;
  box-sizing: border-box;
  left: 0;
  width: 100%;
  z-index: 1;
}

.login-butt {
  width: 100%;
  height: 112rpx;
  border-radius: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  color: #fff;
  opacity: 0.5;
  background-color: #ed171f;
}

.login-butt-active {
  opacity: 1;
}

.login-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

}

.login-dialog-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
}

.login-dialog-content {
  position: relative;
  width: 656.84rpx;
  height: 1132.62rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 74.41rpx 73.24rpx 105.47rpx 73.24rpx;
  box-sizing: border-box;

}

.login-dialog-close {
  position: absolute;
  top: 32.81rpx;
  right: 43.36rpx;
  width: 28.12rpx;
  height: 28.12rpx;
}

.login-tips-top {
  position: fixed;
  bottom: 420rpx;
  width: 145.9rpx;
  height: 66.21rpx;
  left: 50%;
  transform: translateX(-122%);
}

.login-tips {
  position: fixed;
  bottom: 380rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.login-tips-text{

font-family: HYQiHei_60S;
font-size: 24rpx;
color: #FFFFFF;
}
.login-tips-text-blue{

font-family: HYQiHei_60S;
font-size: 24rpx;
color: #31C5FF;

}
.login-dialog-scroll {
  height: 877.73rpx;
  width: 506.65rpx;
  overflow-y: auto;
}

.login-dialog-scroll div {
  font-family: HYQiHei_50S;
  font-size: 24rpx;
  color: #000000;

}

.login-dialog-title {
  text-align: center;
  font-family: HYQiHei_60S;
  font-size: 36rpx;
  color: #333D47;
  margin-bottom: 50rpx;
}
</style>
