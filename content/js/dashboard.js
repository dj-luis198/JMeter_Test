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

    var data = {"OkPercent": 99.38837920489297, "KoPercent": 0.6116207951070336};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7985564304461942, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b00c4345-6f17-4f46-b117-0ca4ed568ec2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5915c2ff-e865-474d-8bd0-3c1e8316d756"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e9a6d93-71fe-43de-bee3-e349536fa02c"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f0ea756-1233-46e1-b5ad-59c049cfa49e"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06971304-4cb7-4596-80c4-47752d7e057d"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1b1d34c-d882-404d-a324-45de80517d9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4d459c3-e465-42e2-9444-fbb5988feb24"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b1b3454-fc6b-4a96-a2b4-78e2d0332362"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f528760-88cf-4df5-8dec-0665d123cb12"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/681b44bc-c03a-45ac-aa04-86d3ab4cc106"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=353b7ea6-a761-443c-b97c-698e3f9d4967"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3a6b70e-7ec4-449b-9e53-d6c8ce1b69c6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/192b26f0-9522-4e81-a686-d377108376c3"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff0f7e4b-3a34-420c-8c06-71837962de08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b00c4345-6f17-4f46-b117-0ca4ed568ec2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1fdd860-22ba-432f-939a-3eb641de8e65"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f14106e6-068b-4f67-abea-9342ec85bb14"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e9a6d93-71fe-43de-bee3-e349536fa02c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9573863636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b1b3454-fc6b-4a96-a2b4-78e2d0332362"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24106562-6279-4227-96bb-df2201135db0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f528760-88cf-4df5-8dec-0665d123cb12"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06971304-4cb7-4596-80c4-47752d7e057d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f14106e6-068b-4f67-abea-9342ec85bb14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8efe300e-ca83-4769-979c-bfd2b3b8aded"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/353b7ea6-a761-443c-b97c-698e3f9d4967"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=681b44bc-c03a-45ac-aa04-86d3ab4cc106"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3a6b70e-7ec4-449b-9e53-d6c8ce1b69c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1b1d34c-d882-404d-a324-45de80517d9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1fdd860-22ba-432f-939a-3eb641de8e65"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4d459c3-e465-42e2-9444-fbb5988feb24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f0ea756-1233-46e1-b5ad-59c049cfa49e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/579a87d4-a64f-4754-b67e-6e8b9039d162"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 8, 0.6116207951070336, 353.590978593272, 106, 1921, 135.5, 900.1000000000001, 1092.0, 1518.6900000000048, 5.067233824947991, 717.0349388048223, 3.6895312033905525], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1607.839285714286, 1304, 2120, 1568.5, 1892.9, 1988.05, 2120.0, 0.25216478969006245, 303.43897119580146, 1.2398923008686176], "isController": true}, {"data": ["deleteBook", 15, 0, 0.0, 531.7333333333333, 392, 1054, 477.0, 833.8000000000002, 1054.0, 1054.0, 0.08845330550002653, 0.01598033351318839, 0.06012060608204929], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 531.7333333333333, 392, 1054, 477.0, 833.8000000000002, 1054.0, 1054.0, 0.08641399215360951, 0.015611902879314219, 0.05873451029190647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 150.76470588235296, 106, 339, 112.0, 336.6, 339.0, 339.0, 0.0797856113689803, 0.02134888429209043, 0.04550273148387157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 128.76470588235293, 108, 340, 115.0, 174.39999999999986, 340.0, 340.0, 0.0798710786824091, 0.0593573153098763, 0.04009153754175613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 138.0, 109, 324, 113.0, 319.2, 324.0, 324.0, 0.0798699529237101, 0.02152744824896874, 0.04703279454394257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 217.82352941176467, 108, 342, 126.0, 340.4, 342.0, 342.0, 0.07978523691522114, 0.0215046146373057, 0.04690499279586243], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 318.6, 187, 815, 226.0, 798.8, 815.0, 815.0, 0.08890732892748127, 0.18839555611534245, 0.057477198974602135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b00c4345-6f17-4f46-b117-0ca4ed568ec2", 1, 0, 0.0, 859.0, 859, 859, 859.0, 859.0, 859.0, 859.0, 1.1641443538998835, 0.2103190483119907, 0.8026229627473807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5915c2ff-e865-474d-8bd0-3c1e8316d756", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 113.88235294117648, 109, 125, 114.0, 117.8, 125.0, 125.0, 0.09603488891022997, 0.07136967818426271, 0.04820501259751778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 124.52941176470588, 107, 320, 112.0, 161.59999999999985, 320.0, 320.0, 0.0960419420810594, 0.03418404602103883, 0.054299448182547484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 696.3333333333334, 552, 784, 753.0, 784.0, 784.0, 784.0, 0.026761342348932224, 7.868723210781252, 0.015262328058375407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 855.3333333333334, 772, 997, 797.0, 997.0, 997.0, 997.0, 0.026758239307853544, 24.07711076517415, 0.01523442726218615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 262.0, 113, 342, 331.0, 342.0, 342.0, 342.0, 0.026867275658248254, 0.047542483879634605, 0.01487670439279957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 151.26666666666668, 107, 478, 112.0, 383.80000000000007, 478.0, 478.0, 0.08129684730826138, 0.06041689531404973, 0.04080720655902964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 156.26666666666668, 110, 339, 112.0, 330.0, 339.0, 339.0, 0.08130169432730978, 0.0298953105182712, 0.04591216774707585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 197.0, 108, 740, 111.0, 497.0000000000001, 740.0, 740.0, 0.08130213499406494, 4.897506167105698, 0.04733096947375838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 238.66666666666663, 107, 905, 119.0, 567.8000000000002, 905.0, 905.0, 0.08130213499406494, 1.6141543798815157, 0.04741036608996352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 263.3333333333333, 111, 345, 334.0, 345.0, 345.0, 345.0, 0.02692273175984923, 0.02000800670824733, 0.015117744884680965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 203.23529411764707, 107, 998, 115.0, 471.59999999999957, 998.0, 998.0, 0.09592813289996388, 5.1017642753052765, 0.055910319186755146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 694.4285714285714, 107, 1128, 782.0, 1110.0, 1128.0, 1128.0, 0.06617007600105872, 42.53363190118444, 0.034838988117744926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 148.88235294117646, 109, 527, 112.0, 366.9999999999999, 527.0, 527.0, 0.09592596772373321, 1.6834764875578376, 0.05600273494808712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 543.2857142857143, 109, 912, 653.5, 850.0, 912.0, 912.0, 0.06616819956328988, 13.901986729731263, 0.034902617543080224], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 552.2307692307693, 209, 1679, 414.0, 1350.9999999999998, 1679.0, 1679.0, 0.07982365113380287, 0.014421265097415556, 0.05503466572311017], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8e9a6d93-71fe-43de-bee3-e349536fa02c", 3, 0, 0.0, 398.6666666666667, 347, 426, 423.0, 426.0, 426.0, 426.0, 0.057576048363880625, 0.025489396411092987, 0.03692214038959793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 407.73333333333335, 222, 1013, 238.0, 887.0000000000001, 1013.0, 1013.0, 0.08124840888532599, 6.597614123546331, 0.18134369803487183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f0ea756-1233-46e1-b5ad-59c049cfa49e", 3, 0, 0.0, 289.0, 224, 385, 258.0, 385.0, 385.0, 385.0, 0.03289365481398639, 0.027422086581581746, 0.02109391275506288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 514.9545454545455, 130, 1465, 420.0, 1042.6999999999998, 1410.249999999999, 1465.0, 0.09817045961624275, 0.06030197177599286, 0.04438761992414101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 114.07142857142858, 110, 123, 113.5, 121.5, 123.0, 123.0, 0.0661678868340084, 0.04917359558660195, 0.03321317757097687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 222.1428571428572, 108, 340, 218.5, 339.5, 340.0, 340.0, 0.0661678868340084, 0.08869155366924564, 0.033767038230859754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06971304-4cb7-4596-80c4-47752d7e057d", 3, 0, 0.0, 368.6666666666667, 200, 462, 444.0, 462.0, 462.0, 462.0, 0.03914098583096313, 0.03263022939879446, 0.02510017646061112], "isController": false}, {"data": ["login", 22, 0, 0.0, 2289.363636363637, 1354, 3878, 2331.0, 3495.2999999999993, 3855.2, 3878.0, 0.09695046712497797, 15.952806020568923, 0.16820010906927552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 129.64705882352942, 111, 324, 117.0, 166.39999999999986, 324.0, 324.0, 0.09711178137281785, 0.07861881519342381, 0.03452020353486884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1b1d34c-d882-404d-a324-45de80517d9e", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4d459c3-e465-42e2-9444-fbb5988feb24", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 814.7857142857143, 225, 1242, 903.0, 1224.5, 1242.0, 1242.0, 0.06613225506266031, 56.54154655592663, 0.13664687914802762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b1b3454-fc6b-4a96-a2b4-78e2d0332362", 3, 0, 0.0, 275.0, 210, 375, 240.0, 375.0, 375.0, 375.0, 0.0346476335666274, 0.028884306498741137, 0.02221869730672395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f528760-88cf-4df5-8dec-0665d123cb12", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 0.6316925262237763, 2.4106752622377625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/681b44bc-c03a-45ac-aa04-86d3ab4cc106", 3, 0, 0.0, 531.0, 231, 815, 547.0, 815.0, 815.0, 815.0, 0.021585063136309673, 0.025512813882793105, 0.013841983847177752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=353b7ea6-a761-443c-b97c-698e3f9d4967", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 386.70588235294116, 222, 681, 443.0, 502.59999999999985, 681.0, 681.0, 0.07974332032422696, 0.12358657163530096, 0.17934459639325653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1119.3333333333333, 1107, 1142, 1109.0, 1142.0, 1142.0, 1142.0, 0.026731535192066083, 31.980209474992648, 0.06027647925632869], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1071.0000000000002, 237, 1889, 1002.0, 1736.1, 1869.7999999999997, 1889.0, 0.10273029096020135, 0.03281459400522057, 0.0463490179918096], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 319.29411764705884, 219, 1112, 231.0, 585.5999999999996, 1112.0, 1112.0, 0.09585781466737338, 6.885661538743473, 0.21414375888094458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 131.06250000000003, 111, 343, 116.5, 190.40000000000015, 343.0, 343.0, 0.08964087623956524, 0.06959423497114683, 0.03186453022578296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3a6b70e-7ec4-449b-9e53-d6c8ce1b69c6", 1, 0, 0.0, 1679.0, 1679, 1679, 1679.0, 1679.0, 1679.0, 1679.0, 0.5955926146515784, 0.10760218135795116, 0.41063318939845145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 430.95238095238096, 223, 1125, 238.0, 1101.0, 1123.4, 1125.0, 0.10763821259059549, 18.539090370608616, 0.23814654205835015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 131.27272727272728, 108, 326, 113.0, 284.20000000000016, 326.0, 326.0, 0.05963417146450682, 0.044317973129384465, 0.029933558723395027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 172.63636363636363, 108, 333, 116.0, 332.0, 333.0, 333.0, 0.0595699052838506, 0.024073349507465192, 0.033518648765007555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 214.63636363636365, 106, 999, 112.0, 867.6000000000005, 999.0, 999.0, 0.05956184143554867, 4.886762490727304, 0.03455052130148038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 167.81818181818178, 107, 533, 110.0, 490.20000000000016, 533.0, 533.0, 0.059636757928978046, 1.6087206051775549, 0.034652217741935484], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1037.2500000000002, 851, 1609, 904.0, 1426.8, 1466.1499999999999, 1609.0, 0.24678300722721663, 295.23827229860746, 0.4873000396615548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/192b26f0-9522-4e81-a686-d377108376c3", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.7585176662707839, 1.417291419239905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1071.0000000000002, 237, 1889, 1002.0, 1736.1, 1869.7999999999997, 1889.0, 0.09732230936992653, 0.031087151022105436, 0.043909088797759815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 155.2, 106, 334, 113.0, 334.0, 334.0, 334.0, 0.030491709304240177, 0.008218468523408485, 0.017955567100055494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff0f7e4b-3a34-420c-8c06-71837962de08", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 113.2, 109, 120, 112.0, 120.0, 120.0, 120.0, 0.030490593651858404, 0.008218167820227459, 0.017925134158612067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b00c4345-6f17-4f46-b117-0ca4ed568ec2", 3, 0, 0.0, 910.6666666666666, 420, 1524, 788.0, 1524.0, 1524.0, 1524.0, 0.018826364440762845, 0.025953663218304248, 0.012072896467546486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1fdd860-22ba-432f-939a-3eb641de8e65", 3, 0, 0.0, 558.3333333333334, 226, 1038, 411.0, 1038.0, 1038.0, 1038.0, 0.0816748795295527, 0.03695575603713484, 0.052376143448313414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 245.875, 108, 978, 114.0, 973.1, 978.0, 978.0, 0.08697968480736717, 9.803572435730167, 0.05020018918081446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 248.625, 108, 791, 111.0, 763.7, 791.0, 791.0, 0.08697873913445282, 3.2173427111816606, 0.050284583562105536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 154.75, 110, 342, 113.0, 332.90000000000003, 342.0, 342.0, 0.08697732066363695, 0.06463841896975364, 0.043658537911239644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 110.6, 107, 113, 111.0, 113.0, 113.0, 113.0, 0.030490965526914375, 0.008158715385131386, 0.017389378777068355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 153.4375, 108, 339, 111.5, 339.0, 339.0, 339.0, 0.08687531220815325, 0.03955626398149556, 0.048634055393870945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 110.6, 108, 116, 109.0, 116.0, 116.0, 116.0, 0.030490965526914375, 0.02265978981052914, 0.015305035430501941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 115.8, 113, 122, 115.0, 122.0, 122.0, 122.0, 0.030559358497946415, 0.024053557567719538, 0.010862896966066887], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 616.5384615384615, 375, 1576, 423.0, 1404.7999999999997, 1576.0, 1576.0, 0.08192227466648182, 0.014800410950487437, 0.05576154828372834], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1267.2727272727273, 942, 1921, 1233.5, 1835.8999999999999, 1919.35, 1921.0, 0.09716456143450225, 0.05029025152371699, 0.04469190276919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 269.8, 220, 450, 226.0, 450.0, 450.0, 450.0, 0.03047015448368323, 0.047222788247661414, 0.0685280915780493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f14106e6-068b-4f67-abea-9342ec85bb14", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1123.1833333333332, 571, 2263, 960.0, 1786.1, 1845.45, 2263.0, 0.2794753316440602, 101.37415436878167, 1.0135711474325533], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e9a6d93-71fe-43de-bee3-e349536fa02c", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 198.62499999999994, 108, 468, 116.0, 447.70000000000005, 455.45, 468.0, 0.2478205071469664, 0.18417129486214984, 0.11979604593530115], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 610.6428571428573, 527, 868, 555.5, 781.4000000000001, 802.9499999999999, 868.0, 0.24739462535176426, 72.74223412808857, 0.12442210161734236], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 197.92857142857133, 107, 469, 116.0, 339.20000000000005, 437.0, 469.0, 0.2482247497805871, 0.4392414517601794, 0.12071867713938705], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 834.8928571428572, 736, 1145, 780.5, 986.2, 1015.0999999999998, 1145.0, 0.24730612965907084, 222.52649018503797, 0.1241360846140258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 119.85714285714286, 112, 141, 118.0, 126.6, 139.59999999999997, 141.0, 0.10758472296933835, 0.08037335260892954, 0.03824300699300699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, 2.840909090909091, 185.1420454545454, 109, 1091, 120.0, 337.0, 433.20000000000005, 940.079999999998, 0.7203726291145146, 1.5455051472363885, 0.34733165382820747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 120.18181818181817, 114, 135, 118.0, 133.0, 135.0, 135.0, 0.05955797156377576, 0.046122530712963065, 0.021170997704310916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 141.94117647058826, 112, 332, 117.0, 324.0, 332.0, 332.0, 0.0777412952614394, 0.06308888316626576, 0.027634601049964787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b1b3454-fc6b-4a96-a2b4-78e2d0332362", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24106562-6279-4227-96bb-df2201135db0", 2, 0, 0.0, 190.0, 186, 194, 190.0, 194.0, 194.0, 194.0, 0.030855150495996547, 0.03569133375244913, 0.019179007119825977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f528760-88cf-4df5-8dec-0665d123cb12", 3, 0, 0.0, 442.66666666666663, 187, 942, 199.0, 942.0, 942.0, 942.0, 0.10330222788471471, 0.04573275713646224, 0.0662452437932578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 368.6363636363636, 221, 1326, 231.0, 1151.4000000000005, 1326.0, 1326.0, 0.05952380952380952, 6.557606618641774, 0.13248592228084416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06971304-4cb7-4596-80c4-47752d7e057d", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 459.3125, 224, 1300, 336.5, 1154.4, 1300.0, 1300.0, 0.08682204194589901, 13.10140585573975, 0.19248802805437232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f14106e6-068b-4f67-abea-9342ec85bb14", 3, 0, 0.0, 299.3333333333333, 212, 406, 280.0, 406.0, 406.0, 406.0, 0.024830120591619008, 0.024902865085539766, 0.01592296144709943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8efe300e-ca83-4769-979c-bfd2b3b8aded", 2, 0, 0.0, 204.5, 195, 214, 204.5, 214.0, 214.0, 214.0, 0.03809015940731712, 0.033663666273068354, 0.023676158655036472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/353b7ea6-a761-443c-b97c-698e3f9d4967", 3, 0, 0.0, 536.6666666666667, 193, 1148, 269.0, 1148.0, 1148.0, 1148.0, 0.026294108366785283, 0.0263711418873911, 0.016861781732606447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=681b44bc-c03a-45ac-aa04-86d3ab4cc106", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3a6b70e-7ec4-449b-9e53-d6c8ce1b69c6", 3, 0, 0.0, 487.3333333333333, 188, 891, 383.0, 891.0, 891.0, 891.0, 0.01733162327983639, 0.023893041858758825, 0.01111435477255133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 133.13333333333335, 113, 328, 117.0, 223.00000000000006, 328.0, 328.0, 0.08143676164002779, 0.06751934632068711, 0.028948223864228628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1b1d34c-d882-404d-a324-45de80517d9e", 3, 0, 0.0, 335.0, 226, 537, 242.0, 537.0, 537.0, 537.0, 0.020861148197596796, 0.028745195416805744, 0.013377754540776592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 164.42857142857144, 112, 350, 117.0, 341.0, 350.0, 350.0, 0.06469769999676511, 0.050229171384207294, 0.0229980105457251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1fdd860-22ba-432f-939a-3eb641de8e65", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4d459c3-e465-42e2-9444-fbb5988feb24", 3, 0, 0.0, 716.6666666666667, 204, 1576, 370.0, 1576.0, 1576.0, 1576.0, 0.06714113065664025, 0.03037961315518553, 0.043055998500514746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f0ea756-1233-46e1-b5ad-59c049cfa49e", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 114.90476190476191, 107, 136, 113.0, 129.8, 135.7, 136.0, 0.10770059235325795, 0.08003920974690361, 0.05406064889606892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 164.1428571428571, 108, 347, 112.0, 337.8, 346.09999999999997, 347.0, 0.10770335419017335, 0.051928402913119294, 0.06013236934557391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 280.3333333333333, 109, 1018, 113.0, 983.8000000000001, 1015.3, 1018.0, 0.1077050113603143, 13.869619677897905, 0.06199649509942198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 247.19047619047615, 108, 763, 115.0, 697.4000000000001, 760.5, 763.0, 0.10770280181145855, 4.548910775280668, 0.06210040176991605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/579a87d4-a64f-4754-b67e-6e8b9039d162", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 37.5, 0.22935779816513763], "isController": false}, {"data": ["401/Unauthorized", 5, 62.5, 0.382262996941896], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 8, "401/Unauthorized", 5, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
