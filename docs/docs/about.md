---
layout: page
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'
import { Friends, Creators } from './vue/member.config'
</script>

<div class='description'>
    <div class='text-size-24 title'>关于我</div>
    <div class='text-size-20'>我叫Jack，目前工作是Front end developer。</div>
    <div class='text-size-18'>希望在开源的路上能结交到更多小伙伴，一起加入拥抱开源。可以做出在社区具有一定影响力的产品!</div>
</div>
<div class='description text-size-24 title' style='margin-top: 50px'>贡献者</div>
<VPTeamMembers size="small" :members="Creators" />
<div class='description'>
    <div class='text-size-20 my'>以下是友链(排名不分先后)</div>
</div>
<VPTeamMembers size="small" :members="Friends" />
<h2 class='description text-size-24 title' style='margin-top: 50px'>如果你想了解更多可以提高生产力的工具，那么这个可能会帮到你</h2>
<div class='description github-users_flex'>
    <a href='https://www.shengchanli.online/?contributor=1511580946661408' target='_blank'>
        <img style='width: 173px; height: 32px; border-radius: 0;' src='https://static01.shengchanli.online/frontend_asset/logo.png' referrerpolicy="no-referrer" alt='数字升产力' />
    </a>

</div>
