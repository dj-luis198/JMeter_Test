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

    var data = {"OkPercent": 67.71523178807946, "KoPercent": 32.28476821192053};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5152625152625152, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c41f8a9b-b3db-48ab-9800-4f7abb375b2d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/034912b6-9f1f-4f3c-bb3f-f0254d2044b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dcc0837-6bdd-4425-8ba3-b4930a43e19e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07e0da3e-6d50-452f-9957-980cdc16fe50"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37ff14b1-63b2-494f-896f-521561c11dbf"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37ff14b1-63b2-494f-896f-521561c11dbf"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f83fb44a-ef23-4c53-a7a9-d34629ea6c44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c4307d2-5d5e-48cf-80b5-e19d110c2dd0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dcc0837-6bdd-4425-8ba3-b4930a43e19e"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f83fb44a-ef23-4c53-a7a9-d34629ea6c44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2f00bb4-12df-47bf-9d33-4d99c4cb5335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/609e4576-9417-4c1b-af68-33be9916fed3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=732edcd8-c283-4e81-9f39-4a3d7aa3eb7c"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/732edcd8-c283-4e81-9f39-4a3d7aa3eb7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d6e8481-a195-4088-9ad0-f9d4a7c63b23"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8741481-d36a-4734-8184-14c5a5400049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9273255813953488, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8741481-d36a-4734-8184-14c5a5400049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8a97c23-adc7-4842-85cb-0401ee8d50d2"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ac1e0d8-9b36-4c57-affc-5f76ab2b8ad4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23ec9b20-00bc-4e77-b64f-ff89c484cd97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8a97c23-adc7-4842-85cb-0401ee8d50d2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=117d3d86-94eb-40bf-a71d-3fd87e4dcaa5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2f00bb4-12df-47bf-9d33-4d99c4cb5335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/117d3d86-94eb-40bf-a71d-3fd87e4dcaa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=609e4576-9417-4c1b-af68-33be9916fed3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/91a332d3-2348-416d-bb4e-6082061c5de0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91a332d3-2348-416d-bb4e-6082061c5de0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ac1e0d8-9b36-4c57-affc-5f76ab2b8ad4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/090d3d5e-7e09-44c7-91ac-645c6e720a8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=090d3d5e-7e09-44c7-91ac-645c6e720a8a"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=034912b6-9f1f-4f3c-bb3f-f0254d2044b6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 604, 195, 32.28476821192053, 293.2566225165564, 126, 2572, 137.0, 639.0, 981.25, 1457.5500000000004, 2.3427197269412767, 2.466935810352184, 1.1209219368163836], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c41f8a9b-b3db-48ab-9800-4f7abb375b2d", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["see books", 58, 58, 100.0, 731.1206896551722, 515, 960, 786.5, 937.1, 941.9, 960.0, 0.26724046573562543, 1.7190061174452733, 0.44861949277298846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 166.33333333333334, 127, 390, 132.0, 389.4, 390.0, 390.0, 0.07695188455165267, 0.038250497301553915, 0.03862623892534128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 165.22222222222223, 128, 423, 134.0, 387.90000000000003, 423.0, 423.0, 0.09716074705818849, 0.0754324159289647, 0.03453760930584044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/034912b6-9f1f-4f3c-bb3f-f0254d2044b6", 3, 0, 0.0, 323.3333333333333, 225, 451, 294.0, 451.0, 451.0, 451.0, 0.05350263946354687, 0.03439704197282066, 0.03430996085390212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dcc0837-6bdd-4425-8ba3-b4930a43e19e", 3, 0, 0.0, 272.0, 206, 395, 215.0, 395.0, 395.0, 395.0, 0.02890145566998391, 0.03416054216722382, 0.01853381109045192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 179.11764705882356, 127, 429, 132.0, 401.0, 429.0, 429.0, 0.12375246594987298, 0.061513676922348964, 0.06211793700999483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07e0da3e-6d50-452f-9957-980cdc16fe50", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37ff14b1-63b2-494f-896f-521561c11dbf", 3, 0, 0.0, 361.6666666666667, 219, 543, 323.0, 543.0, 543.0, 543.0, 0.03380091262464086, 0.028178430088445724, 0.021675715452650558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 131.0, 131, 131, 131.0, 131.0, 131.0, 131.0, 7.633587786259541, 2.2513120229007635, 4.71880963740458], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, 100.0, 236.4827586206896, 126, 539, 133.0, 527.2, 530.0, 539.0, 0.2766396863478314, 0.13750937534281857, 0.13372719213103182], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 503.99999999999994, 131, 824, 464.5, 798.5, 824.0, 824.0, 0.08257930562601012, 0.015593065034152443, 0.055845868306652356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 503.99999999999994, 131, 824, 464.5, 798.5, 824.0, 824.0, 0.08182492971823001, 0.015450619750784642, 0.0553357068651116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37ff14b1-63b2-494f-896f-521561c11dbf", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 952.5454545454547, 336, 1551, 950.0, 1403.9999999999998, 1537.0499999999997, 1551.0, 0.09504307179208031, 0.03020722629755394, 0.04288076090619249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f83fb44a-ef23-4c53-a7a9-d34629ea6c44", 3, 0, 0.0, 409.0, 216, 748, 263.0, 748.0, 748.0, 748.0, 0.07329766180458844, 0.0331652831733001, 0.047004034425468494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 158.72727272727275, 129, 396, 137.0, 345.00000000000017, 396.0, 396.0, 0.05404263472583189, 0.042537464442402834, 0.019210467812698053], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 620.8461538461538, 129, 2015, 451.0, 1543.7999999999997, 2015.0, 2015.0, 0.08340390586906869, 0.017098051315857007, 0.05622495877922345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c4307d2-5d5e-48cf-80b5-e19d110c2dd0", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dcc0837-6bdd-4425-8ba3-b4930a43e19e", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1132.2727272727277, 825, 2572, 1017.0, 1459.5, 2405.7999999999975, 2572.0, 0.09798856206239198, 0.05071673622369898, 0.04507091087049476], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 299.40000000000003, 129, 905, 234.0, 645.8000000000002, 905.0, 905.0, 0.08236101578586136, 0.14339717741935484, 0.052312113932738505], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 11, 100.0, 153.72727272727275, 127, 385, 132.0, 335.20000000000016, 385.0, 385.0, 0.05492585010236181, 0.027302009474709142, 0.02757020210216208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f83fb44a-ef23-4c53-a7a9-d34629ea6c44", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2f00bb4-12df-47bf-9d33-4d99c4cb5335", 3, 0, 0.0, 396.3333333333333, 297, 473, 419.0, 473.0, 473.0, 473.0, 0.04333944901113824, 0.027863089777668625, 0.027792550309877057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/609e4576-9417-4c1b-af68-33be9916fed3", 3, 0, 0.0, 316.0, 258, 392, 298.0, 392.0, 392.0, 392.0, 0.015619224141072833, 0.02153236140541779, 0.010016234231091627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=732edcd8-c283-4e81-9f39-4a3d7aa3eb7c", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["addBook", 57, 57, 100.0, 799.9298245614036, 527, 1792, 732.0, 1007.8000000000002, 1349.0999999999979, 1792.0, 0.2518869425344245, 0.8362958934142612, 0.49189763668180936], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/732edcd8-c283-4e81-9f39-4a3d7aa3eb7c", 3, 0, 0.0, 741.3333333333334, 557, 905, 762.0, 905.0, 905.0, 905.0, 0.047310403557742346, 0.029430397525665893, 0.030339028323161595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d6e8481-a195-4088-9ad0-f9d4a7c63b23", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8741481-d36a-4734-8184-14c5a5400049", 3, 0, 0.0, 881.3333333333334, 309, 2015, 320.0, 2015.0, 2015.0, 2015.0, 0.03510167786020171, 0.029262824544263218, 0.02250986503404863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 179.35294117647052, 127, 396, 135.0, 394.4, 396.0, 396.0, 0.12684673929264287, 0.09476343316296075, 0.04509005185793165], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 545.0714285714286, 131, 2277, 428.0, 1502.0, 2277.0, 2277.0, 0.08187900622280447, 0.015460830764866887, 0.056034802598488746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, 5.232558139534884, 210.77906976744188, 127, 1388, 137.5, 393.70000000000005, 480.9999999999999, 1281.4200000000014, 0.7239819004524887, 1.622953771177523, 0.3453103625170999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 237.6, 134, 396, 140.0, 396.0, 396.0, 396.0, 0.027459250472299107, 0.021264829711458197, 0.009760905441325074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 131.1428571428571, 127, 138, 131.0, 137.5, 138.0, 138.0, 0.10155598273548293, 0.05048046407457111, 0.05097634289652171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8741481-d36a-4734-8184-14c5a5400049", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 134.38888888888889, 128, 142, 134.0, 140.2, 142.0, 142.0, 0.10245959961065351, 0.0831483664809112, 0.0364211857990995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8a97c23-adc7-4842-85cb-0401ee8d50d2", 3, 0, 0.0, 482.33333333333337, 277, 837, 333.0, 837.0, 837.0, 837.0, 0.02376745917938886, 0.023837090407453475, 0.015241502143032569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 476.63636363636357, 147, 1180, 447.0, 971.4, 1151.0499999999995, 1180.0, 0.09591949738183372, 0.05891930063786466, 0.04336985086698145], "isController": false}, {"data": ["login", 22, 4, 18.181818181818183, 1860.0454545454545, 1274, 2977, 1783.5, 2658.2999999999997, 2946.6999999999994, 2977.0, 0.09499177457588331, 0.14091908319984112, 0.14271535876666136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ac1e0d8-9b36-4c57-affc-5f76ab2b8ad4", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, 100.0, 182.6, 128, 379, 135.0, 379.0, 379.0, 379.0, 0.02635685067262683, 0.013101208000358452, 0.013229903560283389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23ec9b20-00bc-4e77-b64f-ff89c484cd97", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 171.20000000000002, 130, 398, 136.0, 396.2, 398.0, 398.0, 0.07431334469501803, 0.06016187768766596, 0.02641607174705719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8a97c23-adc7-4842-85cb-0401ee8d50d2", 1, 0, 0.0, 2277.0, 2277, 2277, 2277.0, 2277.0, 2277.0, 2277.0, 0.4391743522178305, 0.07934302261747914, 0.30279012955643386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, 100.0, 158.83333333333334, 128, 389, 131.5, 380.0, 389.0, 389.0, 0.0971738602315977, 0.048302241072151586, 0.048776722811563686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=117d3d86-94eb-40bf-a71d-3fd87e4dcaa5", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2f00bb4-12df-47bf-9d33-4d99c4cb5335", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/117d3d86-94eb-40bf-a71d-3fd87e4dcaa5", 2, 0, 0.0, 251.5, 225, 278, 251.5, 278.0, 278.0, 278.0, 0.04609994468006638, 0.0406976074128711, 0.028654897254748294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=609e4576-9417-4c1b-af68-33be9916fed3", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 228.5, 129, 407, 136.0, 406.5, 407.0, 407.0, 0.10093290845385204, 0.08368363210675818, 0.035878494801955214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 148.47058823529412, 127, 395, 132.0, 194.99999999999983, 395.0, 395.0, 0.07578797200303151, 0.03767195092728813, 0.03804200938433418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91a332d3-2348-416d-bb4e-6082061c5de0", 3, 0, 0.0, 401.0, 318, 552, 333.0, 552.0, 552.0, 552.0, 0.03529910104955994, 0.02942740813408952, 0.022636467795453474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 169.47058823529414, 130, 416, 137.0, 397.59999999999997, 416.0, 416.0, 0.07556731047051764, 0.058667980296935075, 0.026861817393816816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91a332d3-2348-416d-bb4e-6082061c5de0", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ac1e0d8-9b36-4c57-affc-5f76ab2b8ad4", 3, 0, 0.0, 283.3333333333333, 215, 415, 220.0, 415.0, 415.0, 415.0, 0.021409455842997322, 0.021472178858162355, 0.013729371097234612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, 100.0, 146.88888888888889, 126, 379, 132.0, 174.70000000000033, 379.0, 379.0, 0.10613708193782725, 0.052757592486673895, 0.05327583995707344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, 100.0, 130.85714285714283, 128, 137, 131.0, 137.0, 137.0, 137.0, 0.05762502572545791, 0.028643689545173906, 0.03263917472731015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/090d3d5e-7e09-44c7-91ac-645c6e720a8a", 3, 0, 0.0, 290.6666666666667, 225, 413, 234.0, 413.0, 413.0, 413.0, 0.08423417099536712, 0.03910088796855257, 0.054017355748982164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=090d3d5e-7e09-44c7-91ac-645c6e720a8a", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 952.5454545454547, 336, 1551, 950.0, 1403.9999999999998, 1537.0499999999997, 1551.0, 0.09623502342447957, 0.030586060356856966, 0.04341853595909137], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=034912b6-9f1f-4f3c-bb3f-f0254d2044b6", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.051282051282051, 0.6622516556291391], "isController": false}, {"data": ["401/Unauthorized", 11, 5.641025641025641, 1.8211920529801324], "isController": false}, {"data": ["404/Not Found", 180, 92.3076923076923, 29.801324503311257], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 604, 195, "404/Not Found", 180, "401/Unauthorized", 11, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 58, "404/Not Found", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
