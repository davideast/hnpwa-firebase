
export const story = `
<section id="{{id}}" class="hn-story">
  <div class="hn-storyrank">
    <h2 class="hn-h2">{{rank}}</h2>
  </div>
  <div class="hn-storydetails">
    <h4 class="hn-h4">
      <a href="{{url}}">
      {{title}}
      {{#if domain}}
      <span class="hn-link">({{domain}})</span>
      {{/if}}
      </a>
    </h4>
    <div class="hn-storymeta">
      {{#if points}}
      {{points}} points
      {{/if}} 
      {{#if user}} 
      by <a href="/users/{{user}}">{{user}}</a> 
      {{/if}}
      {{time_ago}} |
      <a href="/item/{{id}}">{{comments_count}} comments</a>
    </div>
  </div>
</section>
`;

export const commentTree = `
<div class="hn-commenttree">
  <h2 class="hn-byline">{{title}} ({{domain}})</h2>
  <div class="hn-itemmeta">
    <p>
      {{points}} by
      <a href="/user/{{user}}>{{user}}</a>
      {{time_ago}} | {{comments_count}} comments
    </p>
  </div>
  
  {{> commentList comments }}

</div>
`;

export const commentList = `
  <div class="hn-commentlist">
    {{#each this}}
      <details class="hn-commentthread" open>
        <p class="hn-comment">
          {{{ content }}}
        </p>
        
        {{> commentList comments }}

      </details>
    {{/each}}
  </div>
`;
