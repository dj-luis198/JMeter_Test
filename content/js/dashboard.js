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

    var data = {"OkPercent": 99.43457189014539, "KoPercent": 0.5654281098546042};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7321552321552321, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ca30d47-459f-4334-95a5-f08b23add57c"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0462bb5d-0ace-4b91-a84b-32fc7ee518af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0243b58-ea5c-483f-b9ff-e34dbcc5a4d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b15e8216-e622-4618-9567-ce15763416e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d963277e-f1ed-4b06-a9ce-f7f98e97b6a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=972dd371-3123-4c33-85ef-3f04d9cd26d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85d91394-2da6-47c2-9b41-74890d7ff964"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8d208ad-4061-45bb-9227-51a18f19bedd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/510652a8-9eee-4891-896a-6758c7e4ce75"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a06c9191-ebac-40f2-99c6-4211f02d012d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fecc6a20-52e7-4762-9e67-e5e56595a22c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b831969-dd9f-47a6-9a15-9136f1d69735"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beb8f96a-11b1-4154-a1a9-b30361b107e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c6cdb90f-4281-4a91-a6ea-c7dd7f1278d0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af84a768-c36d-417d-af83-25e7aba5ed0c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/597ca0a7-5a3e-4655-8b9f-6ee6bbabf24b"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0462bb5d-0ace-4b91-a84b-32fc7ee518af"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.21818181818181817, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b180acf7-9804-4173-9648-0281e6dc8786"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85d91394-2da6-47c2-9b41-74890d7ff964"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/972dd371-3123-4c33-85ef-3f04d9cd26d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0243b58-ea5c-483f-b9ff-e34dbcc5a4d3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bde8668-c4c5-4b0e-b09b-0fd36dc47b69"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9539877300613497, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/273e2eec-dd76-4ec6-a3b6-a47f058bafae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d963277e-f1ed-4b06-a9ce-f7f98e97b6a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b831969-dd9f-47a6-9a15-9136f1d69735"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/beb8f96a-11b1-4154-a1a9-b30361b107e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a06c9191-ebac-40f2-99c6-4211f02d012d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b15e8216-e622-4618-9567-ce15763416e5"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510652a8-9eee-4891-896a-6758c7e4ce75"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8d208ad-4061-45bb-9227-51a18f19bedd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af84a768-c36d-417d-af83-25e7aba5ed0c"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fecc6a20-52e7-4762-9e67-e5e56595a22c"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1238, 7, 0.5654281098546042, 497.64539579967726, 136, 3198, 163.5, 1402.700000000001, 1649.1, 2215.2699999999995, 4.868016971212639, 708.8166360203764, 3.5383393814905255], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2320.090909090909, 1651, 3777, 2325.0, 2784.2, 2969.599999999999, 3777.0, 0.23942815849273444, 288.11118118617065, 1.177266384776287], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7ca30d47-459f-4334-95a5-f08b23add57c", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 747.4615384615386, 497, 1600, 563.0, 1496.3999999999999, 1600.0, 1600.0, 0.08670597337459648, 0.015664653392871437, 0.058932966278046055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 747.4615384615386, 497, 1600, 563.0, 1496.3999999999999, 1600.0, 1600.0, 0.08809259209064049, 0.01591516556325048, 0.059875433686607214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0462bb5d-0ace-4b91-a84b-32fc7ee518af", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 207.4375, 137, 415, 139.5, 414.3, 415.0, 415.0, 0.08104056080068074, 0.03689957175128652, 0.04536767722557641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 192.62499999999997, 138, 416, 141.5, 415.3, 416.0, 416.0, 0.08115030558161945, 0.06030799076915274, 0.04073364948139883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 362.8125, 138, 1103, 279.5, 1098.8, 1103.0, 1103.0, 0.08103932939954922, 2.9976440030896243, 0.046850862309114394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 361.125, 137, 1513, 139.0, 1499.0, 1513.0, 1513.0, 0.08115195195804444, 9.146722491390285, 0.04683672227266041], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 370.0, 227, 1282, 270.0, 940.3999999999997, 1282.0, 1282.0, 0.08678585257086398, 0.18107549993657956, 0.05610569765811714], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0243b58-ea5c-483f-b9ff-e34dbcc5a4d3", 3, 0, 0.0, 402.6666666666667, 270, 495, 443.0, 495.0, 495.0, 495.0, 0.04603203829865586, 0.029594165247345487, 0.029519243310010435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b15e8216-e622-4618-9567-ce15763416e5", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d963277e-f1ed-4b06-a9ce-f7f98e97b6a2", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 140.1764705882353, 139, 144, 140.0, 142.4, 144.0, 144.0, 0.142297519000904, 0.10575040230438276, 0.07142668434225065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 155.0, 137, 413, 139.0, 196.9999999999998, 413.0, 413.0, 0.14229871010404546, 0.038076022039559045, 0.08115473310621343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 830.5, 827, 834, 830.5, 834.0, 834.0, 834.0, 0.06966213862765587, 20.482981757227446, 0.039729188436084986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1565.5, 1500, 1631, 1565.5, 1631.0, 1631.0, 1631.0, 0.06778052665469211, 60.989037029348964, 0.03858988968719287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 280.0, 144, 416, 280.0, 416.0, 416.0, 416.0, 0.07137758743754462, 0.12630487152034262, 0.03952255085653105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 140.625, 138, 152, 139.0, 152.0, 152.0, 152.0, 0.04539058599246516, 0.033732652285416005, 0.022783946484499117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 139.875, 138, 144, 139.5, 144.0, 144.0, 144.0, 0.04539032845576429, 0.020667227189941503, 0.02541016190162781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 310.5, 138, 1236, 140.5, 1236.0, 1236.0, 1236.0, 0.04539032845576429, 5.115992014493699, 0.026196957145856146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 223.5, 137, 819, 138.5, 819.0, 819.0, 819.0, 0.045391101074634316, 1.6790163854782518, 0.026241730308772963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 281.5, 147, 416, 281.5, 416.0, 416.0, 416.0, 0.07068886296963914, 0.052533422578022834, 0.03969345332767823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 871.2000000000002, 137, 1780, 821.0, 1776.5, 1779.9, 1780.0, 0.10310234970254972, 46.399732401073294, 0.056182725716819086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 171.1764705882353, 137, 415, 139.0, 410.2, 415.0, 415.0, 0.14229990122712738, 0.03835427025262418, 0.08365677786985419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 597.05, 137, 1239, 479.5, 1108.0, 1232.5, 1239.0, 0.10310181820056397, 15.17157350773006, 0.05628312145909693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 219.7058823529412, 137, 416, 139.0, 414.4, 416.0, 416.0, 0.14230109237015023, 0.03835459130289206, 0.08379644404218808], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 547.8461538461539, 251, 963, 488.0, 933.0, 963.0, 963.0, 0.08825046840633231, 0.015943688139815896, 0.06084456122545959], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=972dd371-3123-4c33-85ef-3f04d9cd26d8", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85d91394-2da6-47c2-9b41-74890d7ff964", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 453.0, 279, 1389, 281.0, 1389.0, 1389.0, 1389.0, 0.04535430213902228, 6.843943154405887, 0.10055234807726104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8d208ad-4061-45bb-9227-51a18f19bedd", 3, 0, 0.0, 316.0, 248, 442, 258.0, 442.0, 442.0, 442.0, 0.018835111158547687, 0.02226246374241102, 0.012078505528105125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510652a8-9eee-4891-896a-6758c7e4ce75", 3, 0, 0.0, 396.0, 251, 578, 359.0, 578.0, 578.0, 578.0, 0.042188752478589206, 0.02712330278164508, 0.027054636192324462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 799.4285714285716, 159, 2422, 692.0, 1335.0, 2315.4999999999986, 2422.0, 0.09775535094170988, 0.06004698802962453, 0.044199929185558276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 141.09999999999997, 139, 148, 140.5, 145.9, 147.9, 148.0, 0.10310022372748548, 0.07662038110997701, 0.05175147948821049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 193.75000000000003, 137, 414, 139.0, 412.9, 413.95, 414.0, 0.10310181820056397, 0.10501484021795725, 0.05447078481104014], "isController": false}, {"data": ["login", 21, 0, 0.0, 3044.857142857143, 1951, 5668, 2822.0, 4575.8, 5560.399999999999, 5668.0, 0.09954824060335715, 11.483748749721501, 0.16591836362839116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.76470588235293, 140, 176, 144.0, 160.79999999999998, 176.0, 176.0, 0.1379500620775279, 0.11168027486549868, 0.04903693612912126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a06c9191-ebac-40f2-99c6-4211f02d012d", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1013.9, 279, 1929, 960.5, 1918.9, 1928.55, 1929.0, 0.10302586979590575, 61.707213919696486, 0.21852752851240945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fecc6a20-52e7-4762-9e67-e5e56595a22c", 3, 0, 0.0, 499.0, 233, 1005, 259.0, 1005.0, 1005.0, 1005.0, 0.08207485226526591, 0.038098547959072006, 0.052632636381046184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b831969-dd9f-47a6-9a15-9136f1d69735", 3, 0, 0.0, 432.3333333333333, 263, 577, 457.0, 577.0, 577.0, 577.0, 0.02287701317715959, 0.02294403567670205, 0.014670480455405076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beb8f96a-11b1-4154-a1a9-b30361b107e2", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6cdb90f-4281-4a91-a6ea-c7dd7f1278d0", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.49509447674418605, 0.9250847868217054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 623.9999999999999, 277, 1930, 556.0, 1726.3000000000002, 1930.0, 1930.0, 0.08097985626075514, 12.21982274584978, 0.17953566276951108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af84a768-c36d-417d-af83-25e7aba5ed0c", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1847.5, 1778, 1917, 1847.5, 1917.0, 1917.0, 1917.0, 0.06683598449405159, 79.95907340261998, 0.15070731269215346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/597ca0a7-5a3e-4655-8b9f-6ee6bbabf24b", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1463.304347826087, 572, 2719, 1488.0, 2398.600000000001, 2711.4, 2719.0, 0.09035233482218268, 0.028741495095439565, 0.04076443231235195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 142.2941176470588, 139, 150, 142.0, 148.4, 150.0, 150.0, 0.08028259473346178, 0.062328772278420035, 0.028537953596660243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 393.82352941176464, 280, 557, 283.0, 556.2, 557.0, 557.0, 0.1421297728431807, 0.22027338818567166, 0.3196531902908644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0462bb5d-0ace-4b91-a84b-32fc7ee518af", 3, 0, 0.0, 770.0, 335, 1172, 803.0, 1172.0, 1172.0, 1172.0, 0.018820222956907964, 0.022244866392100528, 0.012068958081090068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 493.15000000000003, 279, 1791, 417.5, 805.8000000000006, 1743.0999999999995, 1791.0, 0.10572445036501367, 6.479819556446285, 0.23642423719809064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 179.71428571428572, 139, 413, 140.0, 413.0, 413.0, 413.0, 0.04771089921413333, 0.03545702568550338, 0.02394863495709427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 218.0, 137, 416, 139.0, 416.0, 416.0, 416.0, 0.047621315300728606, 0.012742422258202771, 0.027159031382446783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 217.71428571428572, 137, 415, 139.0, 415.0, 415.0, 415.0, 0.0476216392728856, 0.012835519960269947, 0.027996315275661262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 138.71428571428572, 137, 141, 139.0, 141.0, 141.0, 141.0, 0.047711224406336045, 0.012859665953270262, 0.028095574528340467], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1619.3454545454542, 1091, 3173, 1513.0, 2213.8, 2397.799999999999, 3173.0, 0.2345745883215975, 280.63275895435174, 0.4631931812365919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1463.304347826087, 572, 2719, 1488.0, 2398.600000000001, 2711.4, 2719.0, 0.09043973371396664, 0.028769297086660928, 0.040803864234231046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 139.75, 138, 142, 139.5, 142.0, 142.0, 142.0, 0.023395917412411534, 0.006305930865064046, 0.013777088085629057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 207.5, 139, 410, 140.5, 410.0, 410.0, 410.0, 0.023395917412411534, 0.006305930865064046, 0.013754240510031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 495.1764705882352, 137, 1531, 140.0, 1514.2, 1531.0, 1531.0, 0.07919832658594649, 16.784039848405083, 0.044958516964747425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 396.17647058823525, 138, 1096, 148.0, 1095.2, 1096.0, 1096.0, 0.07919758866635919, 5.495551978076244, 0.04503543946509017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 203.58823529411765, 137, 414, 140.0, 413.2, 414.0, 414.0, 0.07929659257877184, 0.05893037788324743, 0.03980317244676633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 207.75, 138, 413, 140.0, 413.0, 413.0, 413.0, 0.023395780570974026, 0.006260199098092659, 0.013342906106883623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 203.94117647058823, 137, 418, 140.0, 414.8, 418.0, 418.0, 0.07929881191721204, 0.04924288584702793, 0.04365807751692097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 213.0, 140, 424, 144.0, 424.0, 424.0, 424.0, 0.023395917412411534, 0.017387005030122245, 0.011743653857401884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 147.25, 143, 156, 145.0, 156.0, 156.0, 156.0, 0.023431825104857418, 0.01844340921339363, 0.008329281580242286], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 628.0, 442, 1005, 558.0, 967.4, 1005.0, 1005.0, 0.08826544815083887, 0.015946394441313662, 0.060079118516733095], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b180acf7-9804-4173-9648-0281e6dc8786", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1629.9523809523807, 894, 3013, 1525.0, 2259.4, 2940.3999999999987, 3013.0, 0.09948457515349049, 0.051491039874365194, 0.04575901845438869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 422.25, 281, 838, 285.0, 838.0, 838.0, 838.0, 0.02337650194024966, 0.03622901228435177, 0.052574300750385716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85d91394-2da6-47c2-9b41-74890d7ff964", 3, 0, 0.0, 471.6666666666667, 344, 558, 513.0, 558.0, 558.0, 558.0, 0.07711487545947614, 0.03413939798987225, 0.04945192208827083], "isController": false}, {"data": ["addBook", 54, 3, 5.555555555555555, 1575.1296296296298, 701, 4036, 1223.5, 2572.5, 3081.5, 4036.0, 0.25713183720697685, 103.55265373299478, 0.9301033675937699], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 259.6545454545454, 138, 581, 141.0, 560.4, 563.1999999999999, 581.0, 0.2356843201364398, 0.17515211682014714, 0.11392943209720478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/972dd371-3123-4c33-85ef-3f04d9cd26d8", 3, 0, 0.0, 378.6666666666667, 230, 550, 356.0, 550.0, 550.0, 550.0, 0.04993342210386152, 0.03164725678262317, 0.032021107273635156], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 885.9090909090912, 683, 1253, 822.0, 1103.6, 1249.0, 1253.0, 0.23547343003442192, 69.23700688385166, 0.11842657858176493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0243b58-ea5c-483f-b9ff-e34dbcc5a4d3", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 201.1454545454545, 138, 569, 142.0, 418.2, 425.0, 569.0, 0.23616502353062416, 0.4179013892944248, 0.11485369308422932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bde8668-c4c5-4b0e-b09b-0fd36dc47b69", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1358.1454545454549, 949, 2610, 1370.0, 1669.8, 1832.5999999999988, 2610.0, 0.23519450585634322, 211.62842979737994, 0.11805661719742228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 173.0, 141, 418, 143.0, 391.3000000000005, 417.9, 418.0, 0.10697189313507875, 0.07991552563313989, 0.03802516513786003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 3, 1.8404907975460123, 241.19631901840492, 139, 3198, 147.0, 403.6, 509.5999999999991, 1928.8799999999706, 0.6910351961607272, 1.5691746965062447, 0.33015776428916643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 143.57142857142858, 139, 150, 143.0, 150.0, 150.0, 150.0, 0.05051890128606689, 0.039122547577979526, 0.017957890691531586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/273e2eec-dd76-4ec6-a3b6-a47f058bafae", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d963277e-f1ed-4b06-a9ce-f7f98e97b6a2", 3, 0, 0.0, 410.0, 333, 469, 428.0, 469.0, 469.0, 469.0, 0.021732831063459867, 0.021796501466966097, 0.013936743878585917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 143.87500000000003, 140, 152, 142.0, 151.3, 152.0, 152.0, 0.07915149596327371, 0.06423329408738325, 0.02813588333069495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b831969-dd9f-47a6-9a15-9136f1d69735", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beb8f96a-11b1-4154-a1a9-b30361b107e2", 3, 0, 0.0, 812.0, 243, 1282, 911.0, 1282.0, 1282.0, 1282.0, 0.025046963055729492, 0.025120342830306824, 0.016062017324149445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a06c9191-ebac-40f2-99c6-4211f02d012d", 3, 0, 0.0, 479.33333333333337, 293, 817, 328.0, 817.0, 817.0, 817.0, 0.02364737041241014, 0.023716649817915245, 0.015164492093895825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b15e8216-e622-4618-9567-ce15763416e5", 3, 0, 0.0, 583.6666666666666, 227, 1040, 484.0, 1040.0, 1040.0, 1040.0, 0.025019181372385495, 0.025092479755312407, 0.016044201596223773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 399.42857142857144, 279, 827, 282.0, 827.0, 827.0, 827.0, 0.04757600266425615, 0.07373351194157667, 0.10699954505447451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510652a8-9eee-4891-896a-6758c7e4ce75", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 748.0588235294118, 279, 1922, 550.0, 1719.6, 1922.0, 1922.0, 0.07914486303283115, 22.372567859445706, 0.17323395657973148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 143.5, 139, 153, 143.0, 153.0, 153.0, 153.0, 0.046592351865441285, 0.03862979173218716, 0.016562125077168584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 160.1, 138, 436, 142.0, 172.20000000000005, 422.8999999999998, 436.0, 0.1045172348920337, 0.08114375169840507, 0.0371526108405276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8d208ad-4061-45bb-9227-51a18f19bedd", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 153.89999999999998, 138, 415, 140.0, 143.8, 401.4499999999998, 415.0, 0.10580331164365445, 0.0786292189070518, 0.053108302914881236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af84a768-c36d-417d-af83-25e7aba5ed0c", 3, 0, 0.0, 687.0, 254, 1332, 475.0, 1332.0, 1332.0, 1332.0, 0.02364289767353887, 0.023712163975316815, 0.015161623833617048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 269.85, 138, 558, 142.0, 421.5, 551.1999999999999, 558.0, 0.10580275192957768, 0.036256040675867976, 0.059896343060132994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 255.60000000000002, 137, 1648, 139.0, 411.9, 1586.1999999999991, 1648.0, 0.1058038713636532, 4.78721704903745, 0.06174647805363198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fecc6a20-52e7-4762-9e67-e5e56595a22c", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 254.3, 136, 817, 140.0, 412.0, 796.7499999999998, 817.0, 0.10580331164365445, 1.5825757650901973, 0.06184947495106597], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.32310177705977383], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.24232633279483037], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1238, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
