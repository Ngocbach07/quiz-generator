module.exports=[93695,(e,t,n)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,n)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,n)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,n)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},38613,e=>{"use strict";var t=e.i(27321),n=e.i(95625),r=e.i(63499),a=e.i(23163),i=e.i(31008),o=e.i(41458),s=e.i(12412),l=e.i(59285),u=e.i(4627),c=e.i(8795),d=e.i(45304),p=e.i(86529),x=e.i(41690),h=e.i(65047),g=e.i(20158),f=e.i(93695);e.i(10904);var m=e.i(26712),v=e.i(80841);let R=`Bạn l\xe0 một chuy\xean gia tạo c\xe2u hỏi trắc nghiệm. Nhiệm vụ của bạn l\xe0 tạo c\xe1c c\xe2u hỏi trắc nghiệm từ nội dung được cung cấp.

Quy tắc:
- C\xe1c c\xe2u hỏi phải dựa tr\xean nội dung được cung cấp.
- Đảm bảo đ\xe1p \xe1n đ\xfang l\xe0 ch\xednh x\xe1c v\xe0 c\xf3 thể x\xe1c minh được từ nội dung.
- Giải th\xedch phải ngắn gọn v\xe0 r\xf5 r\xe0ng.
- Loại "single" c\xf3 đ\xfang 1 đ\xe1p \xe1n đ\xfang. Loại "multi" c\xf3 2 đến 4 đ\xe1p \xe1n đ\xfang.
- Kh\xf4ng tạo c\xe2u hỏi mơ hồ hoặc c\xe2u hỏi c\xf3 thể tranh c\xe3i.
- Ph\xe2n bổ độ kh\xf3 hợp l\xfd.

Trả về JSON theo định dạng:
{
  "title": "Ti\xeau đề b\xe0i quiz",
  "description": "M\xf4 tả ngắn",
  "questions": [
    {
      "id": "q1",
      "question": "Nội dung c\xe2u hỏi?",
      "options": [
        {"id": "a", "text": "Đ\xe1p \xe1n A"},
        {"id": "b", "text": "Đ\xe1p \xe1n B"},
        {"id": "c", "text": "Đ\xe1p \xe1n C"},
        {"id": "d", "text": "Đ\xe1p \xe1n D"}
      ],
      "correctAnswerIds": ["a"],
      "explanation": "Giải th\xedch tại sao đ\xe1p \xe1n đ\xfang",
      "type": "single",
      "difficulty": "easy"
    }
  ]
}`,y=`You are an expert MCQ generator. Your task is to create multiple-choice questions from the provided content.

Rules:
- Questions must be based solely on the provided content.
- Ensure correct answers are accurate and verifiable from the content.
- Explanations should be concise and clear.
- Type "single" has exactly 1 correct answer. Type "multi" has 2 to 4 correct answers.
- Do not create ambiguous or debatable questions.
- Difficulty should be distributed appropriately.

Return JSON in the format:
{
  "title": "Quiz Title",
  "description": "Short description",
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": [
        {"id": "a", "text": "Option A"},
        {"id": "b", "text": "Option B"},
        {"id": "c", "text": "Option C"},
        {"id": "d", "text": "Option D"}
      ],
      "correctAnswerIds": ["a"],
      "explanation": "Explanation of why the answer is correct",
      "type": "single",
      "difficulty": "easy"
    }
  ]
}`;async function w(e){try{let t,{text:n,settings:r,questionCount:a,questionTypes:i,difficulty:o,language:s}=await e.json();if(!n.trim())return v.NextResponse.json({error:"Content is required"},{status:400});let l="vi"===s?`Tạo ${a} c\xe2u hỏi trắc nghiệm từ nội dung sau. Loại c\xe2u hỏi: ${i.includes("single")&&i.includes("multi")?"single-choice và multi-choice":i.join(", ")}. Độ kh\xf3: ${o}. Nội dung:

${n}`:`Generate ${a} multiple-choice questions from the following content. Question types: ${i.includes("single")&&i.includes("multi")?"single-choice and multi-choice":i.join(", ")}. Difficulty: ${o}. Content:

${n}`,u=await fetch(`${r.baseUrl.replace(/\/$/,"")}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r.apiKey}`},body:JSON.stringify({model:r.model,messages:[{role:"system",content:"vi"===s?R:y},{role:"user",content:l}],temperature:r.temperature,max_tokens:r.maxTokens}),signal:AbortSignal.timeout(3e5)});if(!u.ok){let e=await u.text();return v.NextResponse.json({error:`LLM API error: ${e.slice(0,500)}`},{status:502})}let c=await u.json(),d=c.choices?.[0]?.message?.content??"",p=d.match(/```(?:json)?\s*([\s\S]*?)```/);p&&(d=p[1]);try{t=JSON.parse(d)}catch{return v.NextResponse.json({error:"Failed to parse LLM response as JSON",raw:d.slice(0,2e3)},{status:502})}return v.NextResponse.json({quiz:t,raw:c})}catch(t){let e=t instanceof Error?t.message:String(t);return v.NextResponse.json({error:e},{status:500})}}e.s(["POST",0,w],88536);var b=e.i(88536);let E=new t.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/generate/route",pathname:"/api/generate",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/quiz-generator/app/api/generate/route.ts",nextConfigOutput:"standalone",userland:b,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:A,serverHooks:N}=E;async function q(e,t,r){r.requestMeta&&(0,a.setRequestMeta)(e,r.requestMeta),E.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/generate/route";v=v.replace(/\/index$/,"")||"/";let R=await E.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,deploymentId:w,params:b,nextConfig:C,parsedUrl:A,isDraftMode:N,prerenderManifest:q,routerServerContext:T,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,resolvedPathname:j,clientReferenceManifest:P,serverActionsManifest:k}=R,_=(0,s.normalizeAppPath)(v),$=!!(q.dynamicRoutes[_]||q.routes[j]),I=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,A,!1):t.end("This page could not be found"),null);if($&&!N){let e=!!q.routes[j],t=q.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await I();throw new f.NoFallbackError}}let M=null;!$||E.isDev||N||(M="/index"===(M=j)?"/":M);let D=!0===E.isDev||!$,H=$&&!D;k&&P&&(0,o.setManifestsSingleton)({page:v,clientReferenceManifest:P,serverActionsManifest:k});let U=e.method||"GET",L=(0,i.getTracer)(),B=L.getActiveScopeSpan(),K=!!(null==T?void 0:T.isWrappedByNextServer),F=!!(0,a.getRequestMeta)(e,"minimalMode"),G=(0,a.getRequestMeta)(e,"incrementalCache")||await E.getIncrementalCache(e,C,q,F);null==G||G.resetRequestCache(),globalThis.__incrementalCache=G;let Q={params:b,previewProps:q.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:D,incrementalCache:G,cacheLifeProfiles:C.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,r,a)=>E.onRequestError(e,t,r,a,T)},sharedContext:{buildId:y,deploymentId:w}},z=new l.NodeNextRequest(e),J=new l.NodeNextResponse(t),V=u.NextRequestAdapter.fromNodeNextRequest(z,(0,u.signalFromNodeResponse)(t));try{let a,o=async e=>E.handle(V,Q).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=L.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=n.get("next.route");if(r){let t=`${U} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",r),a.updateName(t))}else e.updateName(`${U} ${v}`)}),s=async a=>{var i,s;let l=async({previousCacheEntry:n})=>{try{if(!F&&S&&O&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(a);e.fetchMetrics=Q.renderOpts.fetchMetrics;let s=Q.renderOpts.pendingWaitUntil;s&&r.waitUntil&&(r.waitUntil(s),s=void 0);let l=Q.renderOpts.collectedTags;if(!$)return await (0,p.sendResponse)(z,J,i,Q.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==Q.renderOpts.collectedRevalidate&&!(Q.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&Q.renderOpts.collectedRevalidate,r=void 0===Q.renderOpts.collectedExpire||Q.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:Q.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:r}}}}catch(t){throw(null==n?void 0:n.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,T),t}},u=await E.handleResponse({req:e,nextConfig:C,cacheKey:M,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:q,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:r.waitUntil,isMinimalMode:F});if(!$)return null;if((null==u||null==(i=u.value)?void 0:i.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(s=u.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",S?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,x.fromNodeOutgoingHttpHeaders)(u.value.headers);return F&&$||c.delete(g.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(u.cacheControl)),await (0,p.sendResponse)(z,J,new Response(u.value.body,{headers:c,status:u.value.status||200})),null};K&&B?await s(B):(a=L.getActiveScopeSpan(),await L.withPropagatedContext(e.headers,()=>L.trace(c.BaseServerSpan.handleRequest,{spanName:`${U} ${v}`,kind:i.SpanKind.SERVER,attributes:{"http.method":U,"http.target":e.url}},s),void 0,!K))}catch(t){if(t instanceof f.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:S})},!1,T),$)throw t;return await (0,p.sendResponse)(z,J,new Response(null,{status:500})),null}}e.s(["handler",0,q,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:A})},"routeModule",0,E,"serverHooks",0,N,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,A],38613)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0kcizbm._.js.map