
export const story = `
<section>
  <div class="hn-sr">
    <h2>{{rank}}</h2>
  </div>
  <div class="hn-sd">
    <h4>
      <a href="{{url}}">
      {{title}}
      {{#if domain}}
      <span>({{domain}})</span>
      {{/if}}
      </a>
    </h4>
    <div class="hn-sm">
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
<div>
  <h2>{{title}} {{#if domain}}({{domain}}){{/if}}</h2>
  <div>
    <p class="hn-fl">
      {{points}} points by
      <a href="/user/{{user}}">{{user}}</a>
      {{time_ago}} | {{comments_count}} comments
    </p>
  </div>
  <div class="hn-c">
    {{{content}}}
  </div>
  {{> commentList comments }}
</div>
<script>
  const found = document.querySelectorAll('.hn-c .hn-ch');
  for (let i = 0, len = found.length; i < len; i++) {
    found[i].addEventListener('click', function(e) {
      if (e.target.classList.contains('hidden')) {
        e.target.classList.remove('hidden');
      } else {
        e.target.classList.add('hidden');
      }
    });
  }
</script>
`;

export const commentList = `
  <div class="hn-cl">
    {{#each this}}
      <div class="hn-ct">
        <div class="hn-c">
          <div class="hn-ch">
            <a href="/user/{{user}}">{{ user }}</a>
            {{ time_ago }}
          </div>
          <div class="hn-cb">
            {{{ content }}}

            {{> commentList comments }}
          </div>
        </div>

      </div>
    {{/each}}
  </div>
`;

export const pager = `
<div class="hn-p">
  {{#if nextPositive}}
  <a href="/{{topic}}?page={{back}}">back</a>
  {{else}}
  <div></div>
  {{/if}}
  <div>{{current}}</div>
  {{#if maxedOut}}
  <a href="/{{topic}}?page={{next}}">next</a>
  {{else}}
  <div></div>
  {{/if}}  
</div>
`;
