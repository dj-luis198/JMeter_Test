/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.79897285399854, "KoPercent": 2.201027146001467};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8050473186119874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6a27668-0f93-4b70-a7a4-8d91f0c938f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6342d45c-6728-44a2-9d78-381b37dee80f"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c3f0802-3eed-4b40-b2ca-82145c36c9c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=486049a5-6b82-4858-935d-3b4bd35e77f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c478bfdc-054d-40b5-ad31-36cb3c852b91"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/486049a5-6b82-4858-935d-3b4bd35e77f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8700c551-de94-46b9-a237-13fea3f4d378"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b4f48ea-e0eb-44bd-82d2-66ed84f7add8"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/085bddc6-8e0c-4105-aa44-3d545773cea0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afaeacb6-354c-4d1a-b00e-d454af92da69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bf0ede8-227d-4493-a3d8-e3f8e6869111"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a9bccad-eb79-4c99-8986-730bebe5ed7b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6342d45c-6728-44a2-9d78-381b37dee80f"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7975ecb4-568b-4056-9148-9bf4f890d893"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6a27668-0f93-4b70-a7a4-8d91f0c938f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0379dbf6-de1f-421a-a3c4-09d8af92307c"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35f97618-f05d-4152-8c6f-584f4b6c5109"], "isController": false}, {"data": [0.3524590163934426, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8700c551-de94-46b9-a237-13fea3f4d378"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c478bfdc-054d-40b5-ad31-36cb3c852b91"], "isController": false}, {"data": [0.9194444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=085bddc6-8e0c-4105-aa44-3d545773cea0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b4f48ea-e0eb-44bd-82d2-66ed84f7add8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35f97618-f05d-4152-8c6f-584f4b6c5109"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bf0ede8-227d-4493-a3d8-e3f8e6869111"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afaeacb6-354c-4d1a-b00e-d454af92da69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7975ecb4-568b-4056-9148-9bf4f890d893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a9bccad-eb79-4c99-8986-730bebe5ed7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 30, 2.201027146001467, 300.8584005869404, 79, 2561, 92.0, 814.4000000000005, 1033.8, 1496.5199999999993, 5.279978306765577, 744.9161134912066, 3.871253468254276], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1358.8965517241381, 981, 1950, 1359.5, 1623.6, 1817.8, 1950.0, 0.26319610832788787, 316.7134554117998, 1.2941332084286286], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 500.5714285714285, 85, 925, 502.0, 873.0, 925.0, 925.0, 0.09924573243350536, 0.019550080105484036, 0.06677764613934101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 500.5714285714285, 85, 925, 502.0, 873.0, 925.0, 925.0, 0.10137654870781107, 0.0199698223738043, 0.06821136919890804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6a27668-0f93-4b70-a7a4-8d91f0c938f5", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 133.58823529411765, 79, 328, 82.0, 259.99999999999994, 328.0, 328.0, 0.10917381112930674, 0.02921252368108403, 0.06226318915968275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 83.47058823529412, 81, 97, 82.0, 89.0, 97.0, 97.0, 0.10917311002080711, 0.08113353195882246, 0.05479978374091294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 128.64705882352945, 79, 248, 82.0, 243.2, 248.0, 248.0, 0.1090617481956696, 0.029395549318364075, 0.06422288492381716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 100.29411764705883, 80, 245, 82.0, 238.6, 245.0, 245.0, 0.10917451224681146, 0.029425942754023403, 0.06418267223884815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6342d45c-6728-44a2-9d78-381b37dee80f", 3, 0, 0.0, 328.6666666666667, 209, 435, 342.0, 435.0, 435.0, 435.0, 0.031242514814159107, 0.025740496417524968, 0.020035076231736147], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 238.99999999999997, 81, 644, 209.0, 517.4000000000001, 644.0, 644.0, 0.09152592014058382, 0.1762767770520111, 0.05915220112210778], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 96.23529411764706, 81, 271, 84.0, 134.19999999999987, 271.0, 271.0, 0.10196981693418748, 0.07578030340519205, 0.051184068265793324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 82.52941176470588, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.10197165188077714, 0.03629459760186668, 0.05765194151026015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 582.6249999999999, 400, 652, 633.0, 652.0, 652.0, 652.0, 0.05684805934937396, 16.71521698193653, 0.03242115884768984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 862.25, 562, 1017, 909.5, 1017.0, 1017.0, 1017.0, 0.05667207412707296, 50.99363191842055, 0.03226544845320657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 122.5, 80, 252, 81.0, 252.0, 252.0, 252.0, 0.05698086867334293, 0.10082942776962635, 0.03155093021268109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3f0802-3eed-4b40-b2ca-82145c36c9c9", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 82.14285714285715, 80, 86, 82.0, 85.0, 86.0, 86.0, 0.0682440798260751, 0.05071654760512026, 0.03425532913144785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 139.35714285714286, 81, 252, 82.0, 247.0, 252.0, 252.0, 0.0681918919840431, 0.02556244611622821, 0.03848161315226763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 137.28571428571428, 80, 704, 81.0, 472.0, 704.0, 704.0, 0.06824541049614413, 4.4033189891026705, 0.03970191988963742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 132.14285714285714, 80, 635, 81.5, 438.0, 635.0, 635.0, 0.0681918919840431, 1.449258458838887, 0.039737379020277346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 103.24999999999999, 81, 252, 82.0, 252.0, 252.0, 252.0, 0.05704994722879881, 0.04239747054796474, 0.03203488247710871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 461.2272727272728, 80, 1012, 161.5, 966.5, 1005.3999999999999, 1012.0, 0.10071461597974721, 41.20716517254245, 0.055275013848259696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 148.2941176470588, 80, 889, 82.0, 376.19999999999953, 889.0, 889.0, 0.10197471027185259, 5.423340558416513, 0.059434478999208194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 356.8181818181818, 80, 652, 245.0, 643.4, 650.8, 652.0, 0.10071461597974721, 13.47546182801606, 0.05537336796542742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 143.2941176470588, 80, 656, 82.0, 324.7999999999997, 656.0, 656.0, 0.10197409857896095, 1.7896196553575392, 0.059533706563532865], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 464.57142857142856, 82, 1179, 443.0, 980.0, 1179.0, 1179.0, 0.10136040138718949, 0.01996664156790061, 0.06885097577486407], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=486049a5-6b82-4858-935d-3b4bd35e77f5", 1, 0, 0.0, 1179.0, 1179, 1179, 1179.0, 1179.0, 1179.0, 1179.0, 0.8481764206955047, 0.15323499787955894, 0.5847778837998303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c478bfdc-054d-40b5-ad31-36cb3c852b91", 3, 0, 0.0, 303.3333333333333, 190, 512, 208.0, 512.0, 512.0, 512.0, 0.052726857303548515, 0.034207235223298244, 0.03381247034114277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 255.71428571428575, 162, 785, 167.5, 559.5, 785.0, 785.0, 0.0681640025902321, 5.92294116564096, 0.15205669662636875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/486049a5-6b82-4858-935d-3b4bd35e77f5", 3, 0, 0.0, 884.3333333333334, 644, 1126, 883.0, 1126.0, 1126.0, 1126.0, 0.019033479891128496, 0.026239188586891008, 0.012205714643724979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8700c551-de94-46b9-a237-13fea3f4d378", 3, 0, 0.0, 410.0, 226, 738, 266.0, 738.0, 738.0, 738.0, 0.02290688351849731, 0.022973993528805404, 0.01468963558966136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 531.5909090909091, 91, 1518, 465.0, 1151.3999999999999, 1475.2499999999993, 1518.0, 0.09553918843802112, 0.05868569289796415, 0.04319789477226932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 98.22727272727272, 80, 264, 82.0, 202.59999999999988, 262.34999999999997, 264.0, 0.10071277175281423, 0.07484611260145667, 0.05055309050873683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 117.81818181818181, 79, 243, 82.0, 242.0, 242.85, 243.0, 0.10071507704703395, 0.0957079354324797, 0.05359429792435382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b4f48ea-e0eb-44bd-82d2-66ed84f7add8", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["login", 22, 0, 0.0, 2463.3181818181824, 1476, 4421, 2428.5, 3339.3, 4259.149999999998, 4421.0, 0.09344166903810297, 40.77519354636618, 0.19732750190068848], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/085bddc6-8e0c-4105-aa44-3d545773cea0", 3, 0, 0.0, 355.6666666666667, 201, 585, 281.0, 585.0, 585.0, 585.0, 0.023389442005878548, 0.027645528620880534, 0.014999088786321854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 95.94117647058823, 82, 245, 85.0, 131.3999999999999, 245.0, 245.0, 0.09711400041130636, 0.07862061166110641, 0.034520992333706556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afaeacb6-354c-4d1a-b00e-d454af92da69", 3, 0, 0.0, 554.6666666666666, 184, 1042, 438.0, 1042.0, 1042.0, 1042.0, 0.03529785506700709, 0.029426369409702204, 0.022635668776694002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bf0ede8-227d-4493-a3d8-e3f8e6869111", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a9bccad-eb79-4c99-8986-730bebe5ed7b", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6342d45c-6728-44a2-9d78-381b37dee80f", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 575.7272727272726, 164, 1095, 504.0, 1048.8, 1088.25, 1095.0, 0.10067451927917044, 54.83134372454536, 0.2147109354264481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 274.47058823529414, 163, 409, 323.0, 352.99999999999994, 409.0, 409.0, 0.10900370612600828, 0.1689344547089601, 0.24515188985175496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 632.2307692307693, 81, 1269, 792.0, 1178.6, 1269.0, 1269.0, 0.09069092532648734, 66.77725709220476, 0.1488374884020259], "isController": false}, {"data": ["register", 24, 9, 37.5, 963.9583333333336, 134, 1708, 965.0, 1578.5, 1680.0, 1708.0, 0.09810052851659738, 0.03051271321536745, 0.04426019938932421], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 105.00000000000001, 83, 244, 88.5, 210.10000000000014, 244.0, 244.0, 0.06380161949777492, 0.04953348388743268, 0.02267948193084968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 255.58823529411765, 164, 974, 169.0, 602.7999999999997, 974.0, 974.0, 0.1019172431985228, 7.32092259835014, 0.22768035792436542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 267.56250000000006, 165, 502, 321.5, 379.5000000000001, 502.0, 502.0, 0.07849678653780111, 0.12165468772997105, 0.17654111269194916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7975ecb4-568b-4056-9148-9bf4f890d893", 3, 0, 0.0, 379.33333333333337, 216, 681, 241.0, 681.0, 681.0, 681.0, 0.028895609793685346, 0.028980264900502782, 0.018530062270039106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6a27668-0f93-4b70-a7a4-8d91f0c938f5", 3, 0, 0.0, 492.33333333333337, 292, 752, 433.0, 752.0, 752.0, 752.0, 0.0178536358929496, 0.02461267838757863, 0.011449108954788643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 94.85714285714285, 80, 238, 83.0, 165.5, 238.0, 238.0, 0.08278194644008065, 0.06152056761806775, 0.04155265670918111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 93.92857142857143, 80, 243, 82.5, 164.0, 243.0, 243.0, 0.08278390444372172, 0.031032415072583742, 0.04671608446914821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 131.71428571428572, 79, 784, 82.0, 434.0, 784.0, 784.0, 0.0827848834802765, 5.341432439034847, 0.048160290752337194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0379dbf6-de1f-421a-a3c4-09d8af92307c", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 122.21428571428571, 81, 637, 82.0, 361.5, 637.0, 637.0, 0.0827848834802765, 1.7593982093334044, 0.048241135365110904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 82, 90, 86.0, 90.0, 90.0, 90.0, 0.08582585933141655, 0.025311923357507617, 0.05305446187186199], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 937.1034482758618, 641, 1592, 872.0, 1268.1000000000001, 1427.6, 1592.0, 0.2622547578891205, 313.7478649410605, 0.5178507035662125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 963.9583333333336, 134, 1708, 965.0, 1578.5, 1680.0, 1708.0, 0.09653596769262947, 0.030026079795021962, 0.04355431354882307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 104.85714285714286, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.035704266659865855, 0.009623415623166967, 0.021025071089745224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 104.42857142857144, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.035704266659865855, 0.009623415623166967, 0.0209902036418352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 184.75, 80, 957, 83.0, 742.8000000000008, 957.0, 957.0, 0.06583386823351273, 4.95271812440681, 0.03823164743769099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 144.83333333333331, 79, 480, 82.0, 407.7000000000003, 480.0, 480.0, 0.065835312964619, 1.6294132804913508, 0.0382967787329994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 84.25000000000001, 79, 103, 82.0, 98.80000000000001, 103.0, 103.0, 0.06589062156819679, 0.04896754200527125, 0.03307400340434878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.71428571428572, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.03573379344846421, 0.009561581450077338, 0.020379429076077246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 108.0, 79, 242, 81.5, 241.7, 242.0, 242.0, 0.06589279242672172, 0.025878793640247318, 0.03711831943178449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 82.71428571428572, 81, 87, 82.0, 87.0, 87.0, 87.0, 0.03573251659009699, 0.026555122192445123, 0.017936048366513527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 90.42857142857143, 84, 101, 90.0, 101.0, 101.0, 101.0, 0.03662237103693628, 0.02882581157790102, 0.013018108454535942], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 650.8571428571429, 81, 1734, 548.5, 1430.0, 1734.0, 1734.0, 0.09987444355667162, 0.019283793231366284, 0.0679670111145988], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1306.7727272727273, 743, 2112, 1292.5, 1889.6, 2087.5499999999997, 2112.0, 0.09235897414368538, 0.04780298466421216, 0.04248152033366778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 189.14285714285714, 163, 326, 166.0, 326.0, 326.0, 326.0, 0.035688247859979705, 0.05530981382205839, 0.08026370588040359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35f97618-f05d-4152-8c6f-584f4b6c5109", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 896.311475409836, 416, 3055, 721.0, 1512.6000000000004, 2069.5999999999995, 3055.0, 0.2826219907707704, 78.70601659072166, 1.0290337990997793], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 142.29310344827587, 81, 334, 84.5, 328.0, 331.1, 334.0, 0.26319491398517936, 0.19559700150656398, 0.12722801017838262], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 512.7758620689655, 394, 730, 475.5, 652.5, 719.3, 730.0, 0.26285615876511986, 77.28843832284176, 0.13219816578519214], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.8965517241379, 80, 335, 84.0, 247.0, 326.15, 335.0, 0.26333831254625445, 0.4659853733728644, 0.12806882778128392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8700c551-de94-46b9-a237-13fea3f4d378", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 793.4482758620688, 559, 1257, 775.5, 992.5, 1067.35, 1257.0, 0.262684728506275, 236.36418046044557, 0.1318554203635013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 98.9375, 82, 288, 85.5, 152.20000000000013, 288.0, 288.0, 0.07820748445626247, 0.05842648985257889, 0.027800316740312046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c478bfdc-054d-40b5-ad31-36cb3c852b91", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, 6.666666666666667, 166.0111111111111, 81, 2561, 88.0, 285.00000000000006, 402.9, 1806.8899999999978, 0.7287537905318687, 1.5687421684271468, 0.34983503089106344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 112.14285714285714, 82, 257, 88.5, 251.0, 257.0, 257.0, 0.08397816567692401, 0.06503387244316478, 0.029851613580469078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 105.0, 82, 246, 85.0, 243.6, 246.0, 246.0, 0.1079906746876211, 0.08763696354044251, 0.03838731014286531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=085bddc6-8e0c-4105-aa44-3d545773cea0", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b4f48ea-e0eb-44bd-82d2-66ed84f7add8", 3, 0, 0.0, 782.3333333333334, 213, 1116, 1018.0, 1116.0, 1116.0, 1116.0, 0.059870679332641494, 0.02708992326574599, 0.03839363225433065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35f97618-f05d-4152-8c6f-584f4b6c5109", 3, 0, 0.0, 749.6666666666667, 185, 1734, 330.0, 1734.0, 1734.0, 1734.0, 0.032423669278573354, 0.027030278978654416, 0.02079252229127263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 228.71428571428572, 162, 1023, 168.0, 600.0, 1023.0, 1023.0, 0.08274133875486105, 7.189602470346095, 0.18457505673691801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 284.1666666666667, 163, 1040, 169.0, 831.8000000000008, 1040.0, 1040.0, 0.06580246101204185, 6.653700882918229, 0.14658826234892852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bf0ede8-227d-4493-a3d8-e3f8e6869111", 3, 0, 0.0, 348.3333333333333, 280, 449, 316.0, 449.0, 449.0, 449.0, 0.02689642187934265, 0.03179066010543397, 0.017248030957781584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afaeacb6-354c-4d1a-b00e-d454af92da69", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7975ecb4-568b-4056-9148-9bf4f890d893", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 85.35714285714286, 82, 89, 85.0, 88.5, 89.0, 89.0, 0.06784129014750635, 0.056247319663313367, 0.024115458607121398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 96.63636363636364, 82, 249, 87.0, 114.39999999999999, 229.34999999999974, 249.0, 0.09879603558453573, 0.07670200028291592, 0.035118903274190434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 94.12499999999999, 81, 254, 83.5, 137.10000000000014, 254.0, 254.0, 0.07853069077558873, 0.0583611871877178, 0.03941872564321544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 142.25, 80, 243, 84.5, 242.3, 243.0, 243.0, 0.07852914903850873, 0.02101268245756972, 0.044786155311024506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a9bccad-eb79-4c99-8986-730bebe5ed7b", 3, 0, 0.0, 356.6666666666667, 282, 408, 380.0, 408.0, 408.0, 408.0, 0.04604051565377532, 0.02959961536985881, 0.029524679634745244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 122.0, 80, 243, 82.5, 242.3, 243.0, 243.0, 0.07853146166683028, 0.021166683027387848, 0.04616791008147639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 132.375, 80, 248, 84.0, 245.9, 248.0, 248.0, 0.07853107621931767, 0.021166579137237962, 0.04624437398461772], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 30.0, 0.6603081438004402], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22010271460014674], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.1467351430667645], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.173881144534116], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 30, "401/Unauthorized", 16, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
