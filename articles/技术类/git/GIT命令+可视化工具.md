# GIT 命令+可视化工具

# 初始化

```git
// 使用当前目录作为Git仓库
git init

// 以上命令将目录下以 .c 结尾及 README 文件提交到仓库中。
git add *.c
git add README
git commit -m "初始化项目"

// 添加远程仓库地址
git remote add origin https://github.com/kongmengqian/npm-my-libs.git
// 查看远程仓库地址
git remote -v
// 删除
git remote rm origin
// 修改
git remote origin set-url [url]

// 本地关联远程仓库
git push --set-upstream origin master
git push -u origin master // 简写
git push -u origin master -f // 强制push
```

错误

- 没有关联远程分支，直接 push 的话，会下面的错误

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594785900245-333b488e-ff74-48d9-be4f-fc72b993cf1f.png#align=left&display=inline&height=183&margin=%5Bobject%20Object%5D&name=image.png&originHeight=183&originWidth=668&size=14093&status=done&style=none&width=668)

使用 git 在本地新建一个分支后，需要**做远程分支关联**。如果没有关联，git 会在下面的操作中提示你显示的添加关联。
关联目的是在执行 git pull, git push 操作时就不需要指定对应的远程分支，你只要没有显示指定，git pull 的时候，就会提示你。

**`git branch --set-upstream-to=origin/remote_branch your_branch`**

> origin/remote_branch 是你本地分支对应的远程分支；your_branch 是你当前的本地分支。

# 登录

```git
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
```

# log

```git
git log
git reflog
git status
// 查看分支合并图
git log --graph
```

# 回退

```git
// 回退-之前提交的版本都被删除
git reset --hard commit_id

// 回退-只把当前这个版本提交的内容删除，重新提交一个新的版本，之前的提交的内容都还在
git revert -no-commit commit_id
git revert -n commit_id (简写)

```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1592365768047-86b99e3e-7914-4e7c-b5af-a4a5b4e7ccc5.png#align=left&display=inline&height=800&margin=%5Bobject%20Object%5D&name=image.png&originHeight=800&originWidth=1203&size=205368&status=done&style=none&width=1203)

# 暂存

```git
// 暂存所有文件
git add .
// 暂存指定文件
git add <file>
```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1592366489000-75fcb190-448c-4e20-a375-949dcc55b0af.png#align=left&display=inline&height=800&margin=%5Bobject%20Object%5D&name=image.png&originHeight=800&originWidth=1203&size=74575&status=done&style=none&width=1203)

# 撤销

```git
// 撤销暂存
git reset HEAD <file>
```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1592366638522-ee67db6c-6d3f-4672-a3cd-72ae5c9943ae.png#align=left&display=inline&height=800&margin=%5Bobject%20Object%5D&name=image.png&originHeight=800&originWidth=1203&size=74736&status=done&style=none&width=1203)

```git
// 丢弃之前的操作，撤销的意思，ctrl+z的操作
git checkout -- <某个文件>
git checkout -- <某个文件夹> // 还原本地所有的修改，用这个比较方便
```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1592366824860-d23a82ec-24a7-4559-8fbe-6020df7c743c.png#align=left&display=inline&height=800&margin=%5Bobject%20Object%5D&name=image.png&originHeight=800&originWidth=1203&size=104307&status=done&style=none&width=1203)

# 分支

```git
// 查看分支
git branch
// 创建分支
git branch <name>
// 切换分支
git checkout <name> 或者 git switch <name>
// 创建+切换
git checkout -b <name> 或者 git switch -c <name>
// 合并某分支到当前分支
git merge <name>
// 删除本地分支
git branch -d <name>
// 强行删除分支
git branch -D <name>

// 删除远程分支
git branch -r -d origin/branch-name
git push origin :branch-name

// 如果远程新建了一个分支，本地没有该分支。
// 本地会新建一个分支名叫 branch_name ，会自动跟踪远程的同名分支 branch_name。
git checkout --track origin/branch_name

// 如果本地新建了一个分支 branch_name，但是在远程没有。
// 可以自动在远程创建一个 branch_name 分支，然后本地分支会 track 该分支。
// 后面再对该分支使用 push 和 pull 就自动同步。
git push --set-upstream origin branch_name
git push -u origin branch_name // 简写
git push -u origin branch_name -f // 强行
```

# git 杂文记录

![](https://cdn.nlark.com/yuque/0/2020/jpeg/274409/1594792530048-c50a587d-f896-4d88-a195-fd338f5077ee.jpeg#align=left&display=inline&height=227&margin=%5Bobject%20Object%5D&originHeight=227&originWidth=800&size=0&status=done&style=none&width=800)

- [新建 git 仓库并添加到本地项目](https://blog.csdn.net/theonegis/article/details/80115316)
- [github 账户的创建和配置](https://git-scm.com/book/zh/v2/GitHub-%E8%B4%A6%E6%88%B7%E7%9A%84%E5%88%9B%E5%BB%BA%E5%92%8C%E9%85%8D%E7%BD%AE)（包含 SSH 密钥生成）
- [git 初次登录使用](https://www.cnblogs.com/crazytata/p/10083716.html)
- [git fetch & pull 详解](https://www.cnblogs.com/runnerjack/p/9342362.html)
- [](https://www.cnblogs.com/yiduobaozhiblog1/p/9125465.html)[为什么要使用 git pull --rebase？](https://www.jianshu.com/p/dc367c8dca8e)（rebase 和 merge 的区别）

# 错误记录

#### failed to push some refs to git

> 【参考文章】[如何解决 failed to push some refs to git](https://www.cnblogs.com/yiduobaozhiblog1/p/9125465.html)

![image.png](https://cdn.nlark.com/yuque/0/2020/png/274409/1594784346550-023e3637-0f7e-487b-8b6a-5738448201c7.png#align=left&display=inline&height=157&margin=%5Bobject%20Object%5D&name=image.png&originHeight=157&originWidth=570&size=17554&status=done&style=none&width=570)

**出现错误的主要原因是 github 中的 README.md 文件不在本地代码目录中**

**解决方式：**git pull --rebase origin master 进行代码合并【注：pull = fetch+merge】
