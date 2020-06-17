# GIT 常用命令

## 撤销

```
git checkout -- <file>
```

让文件回到最近一次`git commit`或`git add`时的状态(所有本地修改全部撤销，回到最初的你什么都没修改的样子，使用场景：你用 Ctrl+z 回不到你最初的样子的时候，就可以用上面这个命令)

```
git reset HEAD <file>
```

可以把暂存区的修改撤销掉（清掉暂存区的`<file>`文件）

## 回退

```
git reset --hard HEAD^
git reset --hard HEAD~100
git reset --hard commit_id
```

版本库中的代码回退到上一个版本
版本库中的代码回退到前 100 个版本
版本库中的代码回退到指定 commit_id 的版本
（回退到版本二，失去版本三的提交记录）

```
git revert -no-commit commit_id
git revert -n commit_id
```

回滚，当前这条提交的内容从版本库中删除，会创建一个新的提交并回滚指定的 commit_id 的提交修改（回滚版本二，会提交一个版本四，保留版本三的内容）

## 暂存

```
git add <file>
git add .
```

## 提交

```
git commit
git commit -m "提交说明"
```
